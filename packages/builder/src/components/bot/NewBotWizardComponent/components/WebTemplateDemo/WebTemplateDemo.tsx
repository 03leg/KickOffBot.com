import { Box } from '@mui/material';
import React, { useEffect, useLayoutEffect } from 'react';

interface Props {
    botId: string;
}
const DEMO_BOT_CONTAINER_ID = 'demo-template-container' as const;

export const WebTemplateDemo = ({ botId }: Props) => {
    const isInitialized = React.useRef(false);

    useEffect(() => {
        isInitialized.current = false;
    }, [botId]);

    useLayoutEffect(() => {
        if (!window.KickOffBot) {
            console.error('KickOffBot not found!')
            return;
        }

        if (isInitialized.current) {
            return;
        }

        window.KickOffBot.renderEmbeddedChat({
            containerId: `${DEMO_BOT_CONTAINER_ID}-${botId}`,
            botId: botId,
        });

        isInitialized.current = true

    }, [botId]);

    return (
        <Box key={botId} sx={{ width: '100%', height: '100%' }} id={`${DEMO_BOT_CONTAINER_ID}-${botId}`}>

        </Box>
    )
}
