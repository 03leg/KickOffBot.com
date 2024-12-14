import { Box, Button } from '@mui/material'
import React from 'react'
import AppDialog from '~/components/commons/Dialog/AppDialog';
import { useVariableValueViewerStyles } from './VariableValueViewer.style';
import { Editor } from '@monaco-editor/react';

interface Props {
    title: string;
    value: string;
    onClose: () => void;
}

export const VariableValueViewer = ({ title, onClose, value }: Props) => {
    const { classes } = useVariableValueViewerStyles();
    return (
        <AppDialog
            onClose={onClose}
            maxWidth={'md'}
            buttons={[
                <Button key={'close'} onClick={onClose}>Close</Button>
            ]}
            open={true} title={title}>
            <Box className={classes.root}>
                <Editor height="350px"
                    defaultLanguage="json"
                    value={value}
                    options={{ minimap: { enabled: false }, readOnly: true  }}
                />
            </Box>
        </AppDialog>
    )
}
