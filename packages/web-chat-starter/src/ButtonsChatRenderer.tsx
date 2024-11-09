import ReactDOM from "react-dom/client";
import React, { useCallback } from 'react';
import { EmbeddedChatButtonsOptions, PopupChatInitOptions } from "./initOptions";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Box, Button, createTheme, CssBaseline, Portal, ThemeProvider } from "@mui/material";
import { ButtonDescription } from "./types";
import { createChatTheme, customScrollbarStyle, defaultThemeObject, getChatTheme } from "@kickoffbot.com/web-chat";
import { ChatPopup } from "./components/ChatPopup";


export class ButtonsChatRenderer {
    private static getButtonsContainer(rootContainerId: string, elementIdPostfix: string) {
        const rootContainer = document.querySelector('#' + rootContainerId);
        if (!rootContainer) {
            throw new Error("Failed to find container with id: " + rootContainerId);
        }

        const childContainerId = `${rootContainerId}${elementIdPostfix}`
        const existedChildContainer = document.querySelector('#' + childContainerId);
        if (existedChildContainer) {
            existedChildContainer.innerHTML = '';
            existedChildContainer.remove();
        }

        const newChildContainer = document.createElement('div');
        newChildContainer.id = childContainerId;
        rootContainer.appendChild(newChildContainer);

        const shadowContainer = newChildContainer.attachShadow({ mode: 'open' });
        const shadowRootElement = document.createElement('div');
        shadowContainer.appendChild(shadowRootElement);

        return { shadowContainer, shadowRootElement };
    }

    public static async renderChatPopup({ botId }: PopupChatInitOptions) {
        const bodyElement = document.querySelector('body');
        if (!bodyElement) {
            throw new Error("Failed to find body element");
        }

        const popupElement = document.createElement('div');
        popupElement.id = `kickoffbot-chat-popup`;
        bodyElement.appendChild(popupElement);

        const shadowContainer = popupElement.attachShadow({ mode: 'open' });
        const shadowRootElement = document.createElement('div');
        shadowContainer.appendChild(shadowRootElement);

        const cache = createCache({
            key: "kickoffbot-chat-theme-css",
            prepend: true,
            container: shadowContainer,
        });

        let chatTheme = await getChatTheme(process.env.NEXT_PUBLIC_APP_URL!, botId);
        if (!chatTheme) {
            chatTheme = defaultThemeObject;
        }

        const shadowTheme = createChatTheme(shadowRootElement, chatTheme);

        const root = ReactDOM.createRoot(shadowRootElement);

        const handleClosePopup = () => {
            root.unmount();
            const parent = document.querySelector("#kickoffbot-chat-popup");

            if (parent) {
                parent.innerHTML = '';
                parent.remove();
            }
        };

        root.render(
            <React.StrictMode>
                <CacheProvider value={cache}>
                    <ThemeProvider theme={shadowTheme}>
                        <style type="text/css" data-csp="kickoffbot-chat-theme-css">
                            {customScrollbarStyle}
                        </style>
                        <CssBaseline />
                        <ChatPopup botId={botId} chatTheme={chatTheme} onClose={handleClosePopup} />
                    </ThemeProvider>
                </CacheProvider>
            </React.StrictMode>
        );
    }

    public static renderButtons({ containerId, buttonColor, buttonsOrientation, buttons, buttonStyle, buttonWidth, buttonCssClasses }: EmbeddedChatButtonsOptions) {

        if (buttonStyle === "default") {
            ButtonsChatRenderer.renderDefaultButtons(containerId, buttonsOrientation, buttons, buttonWidth, buttonCssClasses);
            return;
        }

        const { shadowContainer, shadowRootElement } = ButtonsChatRenderer.getButtonsContainer(containerId, "-buttons-container");

        const cache = createCache({
            key: "custom-css",
            prepend: true,
            container: shadowContainer
        });

        const theme = createTheme({
            palette: {
                primary: {
                    main: buttonColor
                }
            },
        });

        const handleButtonClick = (button: ButtonDescription) => {
            ButtonsChatRenderer.renderChatPopup({ botId: button.botId });
        };

        ReactDOM.createRoot(shadowRootElement).render(
            <CacheProvider value={cache}>
                <ThemeProvider theme={theme}>
                    <Box sx={{
                        display: "flex",
                        flexDirection:
                            buttonsOrientation === "horizontal" ? "row" : "column",
                    }}>
                        {buttons.length === 0 && <Box sx={{ color: "red" }}>No buttons found. Please check your button(s) configuration may be your JSON is not valid...</Box>}
                        {buttons.map((button, index) => (
                            <Button fullWidth
                                onClick={() => handleButtonClick(button)}
                                variant={buttonStyle} sx={{
                                    textTransform: "none",
                                    marginRight:
                                        buttonsOrientation === "horizontal" && buttons.length > 0
                                            ? ({ spacing }) => spacing(1)
                                            : undefined,
                                    marginTop:
                                        buttonsOrientation === "vertical" && buttons.length > 0
                                            ? ({ spacing }) => spacing(1)
                                            : undefined,
                                    width: buttonWidth ? buttonWidth : "fit-content",
                                }} key={button.text}>{button.text}</Button>
                        ))}
                    </Box>
                </ThemeProvider>
            </CacheProvider>,
        );
    }

    static renderDefaultButtons(containerId: string, buttonsOrientation: string, buttons: ButtonDescription[], buttonWidth: string | undefined, buttonCssClasses: string | undefined) {
        const rootContainer = document.querySelector('#' + containerId);
        if (!rootContainer) {
            throw new Error("Failed to find container with id: " + containerId);
        }

        const childContainerId = `${containerId}-buttons-container`;
        const existedChildContainer = document.querySelector('#' + childContainerId);
        if (existedChildContainer) {
            existedChildContainer.innerHTML = '';
            existedChildContainer.remove();
        }

        const newChildContainer = document.createElement('div');
        newChildContainer.id = childContainerId;
        rootContainer.appendChild(newChildContainer);

        const handleButtonClick = (button: ButtonDescription) => {
            ButtonsChatRenderer.renderChatPopup({ botId: button.botId });
        };

        ReactDOM.createRoot(newChildContainer).render(
            <Box sx={{
                display: "flex",
                flexDirection:
                    buttonsOrientation === "horizontal" ? "row" : "column",
            }}>
                {buttons.length === 0 && <Box sx={{ color: "red" }}>No buttons found. Please check your button(s) configuration may be your JSON is not valid...</Box>}
                {buttons.map((button, index) => {

                    return <button
                        onClick={() => handleButtonClick(button)}
                        style={{
                            marginRight:
                                buttonsOrientation === "horizontal" && buttons.length > 0
                                    ? '8px'
                                    : undefined,
                            marginTop:
                                buttonsOrientation === "vertical" && buttons.length > 0
                                    ? "8px"
                                    : undefined,
                            width: buttonWidth ? buttonWidth : "fit-content",
                        }}
                        {...(buttonCssClasses && { class: buttonCssClasses })}
                        key={button.text}>{button.text}</button>
                }
                )}
            </Box>,
        );
    }
}