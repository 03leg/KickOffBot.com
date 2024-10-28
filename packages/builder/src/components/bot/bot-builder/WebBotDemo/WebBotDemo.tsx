import React, { useCallback, useLayoutEffect, useRef } from 'react'
import * as ReactDOM from "react-dom/client";
import { useFlowDesignerStore } from '../store';
import { Box, Button, LinearProgress } from '@mui/material';
import {
    ThemeProvider
} from "@mui/material/styles";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ChatViewer } from './components/ChatViewer';
import { useRouter } from 'next/router';
import { createChatTheme } from './theme/createChatTheme';
import { api } from '~/utils/api';
import { Colors } from '~/themes/Colors';
import { EditThemeToolbarButton } from '../FlowDesigner/components/EditThemeToolbarButton';
import RestartAltIcon from '@mui/icons-material/RestartAlt';


export const WebBotDemo = () => {
    const router = useRouter();
    const { showWebBotDemo, project, toggleShowWebBotDemo } = useFlowDesignerStore((state) => ({
        showWebBotDemo: state.showWebBotDemo,
        project: state.project,
        toggleShowWebBotDemo: state.toggleShowWebBotDemo
    }));
    const containerRef = useRef<HTMLDivElement>(null);
    const projectIdFromQuery = router.query.id as string;
    const { data: themeResponse = undefined, isLoading: getThemesLoading } = api.botManagement.getThemeById.useQuery({ botId: projectIdFromQuery }, { enabled: true, refetchOnWindowFocus: false });


    useLayoutEffect(() => {
        if (!showWebBotDemo || themeResponse === undefined || getThemesLoading) return;

        const themeObject = themeResponse ? JSON.parse(themeResponse.theme as string) : undefined

        const container = document.querySelector('#chat-box-root');
        if (!container) {
            throw new Error('InvalidOperationError');
        }

        const shadowContainer = container.attachShadow({ mode: 'open' });
        const shadowRootElement = document.createElement('div');

        shadowContainer.appendChild(shadowRootElement);

        const cache = createCache({
            key: "shadow-my-css",
            prepend: true,
            container: shadowContainer
        });

        const shadowTheme = createChatTheme(shadowRootElement, themeObject);

        const root = ReactDOM.createRoot(shadowRootElement);

        root.render(
            <React.StrictMode>
                <CacheProvider value={cache}>
                    <ThemeProvider theme={shadowTheme}>
                        <ChatViewer height={containerRef.current?.clientHeight} project={project} projectId={projectIdFromQuery} webViewOptions={themeObject} />
                    </ThemeProvider>
                </CacheProvider>
            </React.StrictMode>
        );

        return () => {
            root.unmount();
        }
    }, [getThemesLoading, project, projectIdFromQuery, showWebBotDemo, themeResponse]);


    const handleRestartBot = useCallback(() => {
        toggleShowWebBotDemo();

        setTimeout(() => {
            toggleShowWebBotDemo();
        }, 0);

    }, [toggleShowWebBotDemo]);

    if (!showWebBotDemo) {
        return null;
    }

    if (getThemesLoading) {
        return <LinearProgress sx={{ mt: 3 }} />;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '480px', border: `1px solid ${Colors.BORDER}`, backgroundColor: 'white', height: '100%', minWidth: 480, marginLeft: ({ spacing }) => spacing(2), }}>
            <Box sx={{ borderBottom: `1px solid ${Colors.BORDER}`, height: 48, backgroundColor: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button variant="outlined" sx={{ textTransform: 'none', ml: 1 }} startIcon={<RestartAltIcon />} onClick={handleRestartBot}>
                    Restart
                </Button>
                <EditThemeToolbarButton botProjectId={projectIdFromQuery} />
            </Box>

            <Box sx={{ padding: (theme) => theme.spacing(1), height: 'calc(100% - 48px)' }}>
                <Box id='chat-box-root' ref={containerRef} sx={{ height: '100%' }}></Box>
            </Box>

        </Box>
    )
}
