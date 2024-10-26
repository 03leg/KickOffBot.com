import { Box, LinearProgress, ThemeProvider } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react'
import { ChatViewer } from '~/components/bot/bot-builder/WebBotDemo/components/ChatViewer';
import { createChatTheme } from '~/components/bot/bot-builder/WebBotDemo/theme/createChatTheme';
import { api } from '~/utils/api';

export default function MainWindow() {
    const router = useRouter();
    const projectId = router.query.id as string;
    const { data: themeResponse = undefined, isLoading: getThemesLoading } = api.botManagement.getThemeById.useQuery({ botId: projectId }, { enabled: true, refetchOnWindowFocus: false });

    if (getThemesLoading || themeResponse === undefined) {
        return <LinearProgress sx={{ mt: 3 }} />
    }

    const themeObject = themeResponse ? JSON.parse(themeResponse.theme as string) : undefined

    const theme = createChatTheme(undefined, themeObject);

    return (
        <Box sx={{ height: '100%', width: '100%' }} data-testid="main-window">
            <ThemeProvider theme={theme}>
                <ChatViewer height={'100%'} projectId={projectId} webViewOptions={themeObject} />
            </ThemeProvider>
        </Box>
    )
}