import { EmbedInitOptions } from "./initOptions";
import createCache from "@emotion/cache";
import { ChatViewer, createChatTheme, customScrollbarStyle, defaultThemeObject, getChatTheme } from '@kickoffbot.com/web-chat'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { CacheProvider } from "@emotion/react";
import {
  ThemeProvider
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { WEB_APP_URL, WEB_RUNTIME_URL } from "./constants";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export class WebChatRenderer {
  public static async renderEmbedChatBot(initOptions: EmbedInitOptions) {
    const container = document.querySelector("#" + initOptions.containerId);
    if (!container) {
      throw new Error("Failed to find container with id: " + initOptions.containerId);
    }

    const shadowContainer = container.attachShadow({ mode: "open" });
    const shadowRootElement = document.createElement("div");
    shadowRootElement.setAttribute("style", "width: 100%; height: 100%;");

    shadowContainer.appendChild(shadowRootElement);

    const cache = createCache({
      key: "kickoffbot-theme-css",
      prepend: true,
      container: shadowContainer,
    });

    let chatTheme = await getChatTheme(WEB_APP_URL, initOptions.botId);
    if (!chatTheme) {
      chatTheme = defaultThemeObject;
    }

    const shadowTheme = createChatTheme(shadowRootElement, chatTheme);

    const root = ReactDOM.createRoot(shadowRootElement);

    root.render(
      <React.StrictMode>
        <CacheProvider value={cache}>
          <ThemeProvider theme={shadowTheme}>
            <style type="text/css" data-csp="kickoffbot-theme-css">
              {customScrollbarStyle}
            </style>
            <CssBaseline />
            <ChatViewer height={"100%"} projectId={initOptions.botId} webViewOptions={chatTheme} runtimeUrl={WEB_RUNTIME_URL} />
          </ThemeProvider>
        </CacheProvider>
      </React.StrictMode>
    );
  }
}
