import { WebChatTheme } from '@kickoffbot.com/types';
import { ChatViewer, createChatTheme, getChatTheme, KickoffbotChatStoreProvider } from '@kickoffbot.com/web-chat';
import { Box, LinearProgress, ThemeProvider } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { env } from '~/env.mjs';

export default function MainWindow() {
    const router = useRouter();
    const projectId = router.query.id as string;
    const [chatTheme, setChatTheme] = useState<WebChatTheme | undefined>();
    const [getThemesLoading, setGetThemesLoading] = useState(true);

    useEffect(() => {
        if (projectId === undefined) {
            return;
        }

        getChatTheme(env.NEXT_PUBLIC_APP_URL, projectId).then((theme) => {
            setChatTheme(theme);
        }).finally(() => {
            setGetThemesLoading(false);
        }).catch((e) => {
            console.error(e);
            alert('Error loading chat theme. Please try again later.');
        });
    }, [projectId])

    if (getThemesLoading) {
        return <LinearProgress />
    }

    const theme = createChatTheme(undefined, chatTheme);

    return (
        <Box sx={{ height: '100%', width: '100%' }} data-testid="main-window">
            <ThemeProvider theme={theme}>
                <KickoffbotChatStoreProvider>
                    <ChatViewer height={'100%'} projectId={projectId} webViewOptions={chatTheme} runtimeUrl={env.NEXT_PUBLIC_WEB_BOT_RUNTIME_HOST ?? ''} />
                </KickoffbotChatStoreProvider>
            </ThemeProvider>
        </Box>
    )
}