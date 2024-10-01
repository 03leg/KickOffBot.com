import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react'
import { ChatViewer } from '~/components/bot/bot-builder/WebBotDemo/components/ChatViewer';

export default function MainWindow() {
    const router = useRouter();
    const projectId = router.query.id as string;

    return (
        <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} data-testid="main-window">
            <Box sx={{ height: '100%', width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', }}>
                <ChatViewer height={'100%'} projectId={projectId} />
            </Box>
        </Box>
    )
}