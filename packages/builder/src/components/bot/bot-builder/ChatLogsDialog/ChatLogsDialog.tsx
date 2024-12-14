import React, { useCallback, useEffect } from 'react'
import { useChatLogsDialogStyles } from './ChatLogsDialog.style';
import { Alert, Box, Button, LinearProgress } from '@mui/material';
import { useFlowDesignerStore } from '../store';
import AppDialog from '~/components/commons/Dialog/AppDialog';
import { getDemoBotLogs } from './getDemoBotLogs';
import { useRouter } from 'next/router';
import { WebBotLogItem } from '@kickoffbot.com/types';
import { LogViewer } from './components/LogViewer';

export const ChatLogsDialog = () => {
    const router = useRouter();

    const { classes } = useChatLogsDialogStyles();
    const projectIdFromQuery = router.query.id as string;

    const { toggleShowChatLogs, showChatLogs } = useFlowDesignerStore((state) => ({
        toggleShowChatLogs: state.toggleShowChatLogs,
        showChatLogs: state.showChatLogs
    }));
    const [logs, setLogs] = React.useState<WebBotLogItem[]>([]);
    const [showError, setShowError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleClose = useCallback(() => {
        toggleShowChatLogs();
    }, [toggleShowChatLogs]);

    useEffect(() => {
        if (!showChatLogs) {
            return;
        }
        setShowError(false);
        setIsLoading(true);
        void getDemoBotLogs(projectIdFromQuery).then((logs) => {
            setLogs(logs);
        }).catch(() => setShowError(true)).finally(() => setIsLoading(false));


    }, [projectIdFromQuery, showChatLogs]);

    if (!showChatLogs) {
        return null;
    }

    return (
        <AppDialog
            onClose={handleClose}
            maxWidth={'lg'}
            buttons={[
                <Button key={'close'} onClick={handleClose}>Close</Button>
            ]}
            open={true} title={'Chat Logs'}>
            <Box className={classes.root}>
                {isLoading && <LinearProgress />}
                {showError && !isLoading && <Alert sx={{ mb: 3 }} severity="error">
                    Error loading logs. Please try again later.
                </Alert>}
                {!isLoading && !showError && <LogViewer logs={logs}></LogViewer>}
            </Box>
        </AppDialog>
    )
}
