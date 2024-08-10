import { Box, Button } from '@mui/material'
import React, { useCallback } from 'react'
import AppDialog from '~/components/commons/Dialog/AppDialog';

interface Props {
    title: string;
    children: JSX.Element;
    onClose: VoidFunction;
    onSave: VoidFunction;
}

export const ElementEditorPopup = ({ children, title, onClose, onSave }: Props) => {

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleSave = useCallback(() => {
        onSave();
    }, [onSave]);

    return (
        <AppDialog
            onClose={handleClose}
            maxWidth={'sm'}
            buttons={[
                <Button key={'save'} onClick={handleSave} variant='contained' color='success'>Save</Button>,
                <Button key={'close'} onClick={handleClose}>Close</Button>
            ]}
            open={true} title={title}>
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: (theme) => theme.spacing(1, 0) }}>
                {children}
            </Box>
        </AppDialog>
    )
}
