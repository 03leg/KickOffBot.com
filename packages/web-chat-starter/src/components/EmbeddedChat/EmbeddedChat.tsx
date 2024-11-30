import React, { useEffect, useState } from 'react'
import { ChatViewer, createChatTheme, customScrollbarStyle, getChatTheme, KickoffbotChatStoreProvider } from '@kickoffbot.com/web-chat'
import {
    ThemeProvider
} from "@mui/material/styles";
import { CssBaseline, LinearProgress } from "@mui/material";
import { InitOptionsBase } from '../../initOptions';
import { WebChatTheme } from '@kickoffbot.com/types';

interface Props {
    initOptions: InitOptionsBase;
    shadowRootElement: HTMLDivElement;
}

export const EmbeddedChat = ({ initOptions, shadowRootElement }: Props) => {
    const [chatTheme, setChatTheme] = useState<WebChatTheme | undefined>();
    const [getThemesLoading, setGetThemesLoading] = useState(true);

    useEffect(() => {
        if (initOptions.botId === undefined) {
            return;
        }

        getChatTheme(process.env.NEXT_PUBLIC_APP_URL!, initOptions.botId).then((theme) => {
            setChatTheme(theme);
        }).finally(() => {
            setGetThemesLoading(false);
        }).catch((e) => {
            console.error(e);
            alert('Error loading chat theme. Please try again later.');
        });
    }, [initOptions.botId])

    if (getThemesLoading) {
        return <LinearProgress />
    }

    const shadowTheme = createChatTheme(shadowRootElement, chatTheme);

    return (
        <ThemeProvider theme={shadowTheme}>
            <style type="text/css" data-csp="kickoffbot-theme-css">
                {customScrollbarStyle}
            </style>
            <CssBaseline />
            <KickoffbotChatStoreProvider>
                <ChatViewer height={"100%"} projectId={initOptions.botId} webViewOptions={chatTheme} runtimeUrl={process.env.NEXT_PUBLIC_WEB_BOT_RUNTIME_HOST!}
                    externalVariables={initOptions.externalVariables} />
            </KickoffbotChatStoreProvider>
        </ThemeProvider>
    )
}
