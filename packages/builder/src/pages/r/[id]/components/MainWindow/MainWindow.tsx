import { ChatViewer, createChatTheme } from '@kickoffbot.com/web-chat';
import { Box, LinearProgress, ThemeProvider } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react'
import { env } from '~/env.mjs';
import { api } from '~/utils/api';

export default function MainWindow() {
    const router = useRouter();
    const projectId = router.query.id as string;
    const { data: themeResponse = undefined, isLoading: getThemesLoading } = api.botManagement.getThemeById.useQuery({ botId: projectId }, { enabled: true, refetchOnWindowFocus: false });

    if (getThemesLoading || themeResponse === undefined) {
        return <LinearProgress />
    }

    const themeObject = themeResponse ? JSON.parse(themeResponse.theme as string) : undefined

    const theme = createChatTheme(undefined, themeObject);

    return (
        <Box sx={{ height: '100%', width: '100%' }} data-testid="main-window">
            <ThemeProvider theme={theme}>
                <ChatViewer height={'100%'} projectId={projectId} webViewOptions={themeObject} runtimeUrl={env.NEXT_PUBLIC_WEB_BOT_RUNTIME_HOST ?? ''}/>
            </ThemeProvider>
        </Box>
    )
}