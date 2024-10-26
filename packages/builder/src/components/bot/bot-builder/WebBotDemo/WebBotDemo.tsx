import React, { useLayoutEffect, useRef } from 'react'
import * as ReactDOM from "react-dom/client";
import { useFlowDesignerStore } from '../store';
import { Box, LinearProgress } from '@mui/material';
import {
    ThemeProvider
} from "@mui/material/styles";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ChatViewer } from './components/ChatViewer';
import { useRouter } from 'next/router';
import { createChatTheme } from './theme/createChatTheme';
import { api } from '~/utils/api';



export const WebBotDemo = () => {
    const router = useRouter();
    const { showWebBotDemo, project } = useFlowDesignerStore((state) => ({
        showWebBotDemo: state.showWebBotDemo,
        project: state.project,
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

    if (!showWebBotDemo) {
        return null;
    }

    if (getThemesLoading) {
        return <LinearProgress sx={{ mt: 3 }} />;
    }

    return (
        <Box ref={containerRef} sx={{ width: '450px', backgroundColor: 'white', height: '100%', minWidth: 450, marginLeft: ({ spacing }) => spacing(2), }}>
            <div id='chat-box-root'></div>
        </Box>
    )
}
