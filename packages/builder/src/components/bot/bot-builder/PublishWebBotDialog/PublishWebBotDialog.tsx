import { Button, Box, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import AppDialog from '~/components/commons/Dialog/AppDialog';
import { useFlowDesignerStore } from '../store';
import { env } from '~/env.mjs';

interface Props {
    projectId: string;
}

export const PublishWebBotDialog = ({ projectId }: Props) => {
    const { togglePublishWebBotDialog, showPublishWebBotDialog } = useFlowDesignerStore((state) => ({
        togglePublishWebBotDialog: state.togglePublishWebBotDialog,
        showPublishWebBotDialog: state.showPublishWebBotDialog
    }));

    const handleClose = useCallback(() => {
        togglePublishWebBotDialog();
    }, [togglePublishWebBotDialog]);


    if (!showPublishWebBotDialog) {
        return null;
    }

    return (
        <AppDialog
            onClose={handleClose}
            maxWidth={'sm'}
            buttons={[
                <Button key={'close'} onClick={handleClose}>Close</Button>
            ]}
            open={true} title={'Share your bot'}>
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: (theme) => theme.spacing(1, 0) }}>
                <Typography variant='h5'>Your bot link:</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', padding: (theme) => theme.spacing(2), alignItems: 'center' }}>
                    <a href={`${env.NEXT_PUBLIC_APP_URL}/r/${projectId}`} target="_blank" rel="noreferrer">{`${env.NEXT_PUBLIC_APP_URL}/r/${projectId}`}</a>
                </Box>
            </Box>
        </AppDialog>
    )
}
