import React, { useLayoutEffect, useRef } from 'react'
import * as ReactDOM from "react-dom/client";
import { useFlowDesignerStore } from '../store';
import { Box } from '@mui/material';
import {
    createTheme,
    ThemeProvider
} from "@mui/material/styles";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ChatViewer } from './components/ChatViewer';
import { useRouter } from 'next/router';
import { createChatTheme } from './theme/createChatTheme';



export const WebBotDemo = () => {
    const router = useRouter();
    const { showWebBotDemo, project } = useFlowDesignerStore((state) => ({
        showWebBotDemo: state.showWebBotDemo,
        project: state.project,
    }));
    const containerRef = useRef<HTMLDivElement>(null);
    const projectIdFromQuery = router.query.id as string;

    useLayoutEffect(() => {
        if (!showWebBotDemo) return;

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

        const shadowTheme = createChatTheme(shadowRootElement);

        const root = ReactDOM.createRoot(shadowRootElement);

        root.render(
            <React.StrictMode>
                <CacheProvider value={cache}>
                    <ThemeProvider theme={shadowTheme}>
                        <ChatViewer height={containerRef.current?.clientHeight} project={project} projectId={projectIdFromQuery} />
                    </ThemeProvider>
                </CacheProvider>
            </React.StrictMode>
        );

        return () => {
            root.unmount();
        }
    }, [project, projectIdFromQuery, showWebBotDemo]);

    if (!showWebBotDemo) {
        return null;
    }

    return (
        <Box ref={containerRef} sx={{ width: '450px', backgroundColor: 'white', height: '100%', minWidth: 450, marginLeft: ({ spacing }) => spacing(2), }}>
            <div id='chat-box-root'></div>
        </Box>
    )
}
