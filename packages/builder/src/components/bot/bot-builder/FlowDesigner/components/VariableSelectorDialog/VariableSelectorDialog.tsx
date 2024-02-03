import React, { useCallback, useState } from 'react';
import AbcIcon from '@mui/icons-material/Abc';
import { Box, Button, IconButton, Typography } from '@mui/material';
import SmhDialog from '~/components/commons/Dialog/SmhDialog';
import { VariableSelector } from '../VariableSelector';
import { type BotVariable } from '@kickoffbot.com/types';
import { isNil } from 'lodash';

interface Props {
    onInsertVariable: (variable: BotVariable) => void;
}

export const VariableSelectorDialog = ({ onInsertVariable }: Props) => {
    const [open, setOpen] = useState(false);
    const [selectedVariableInsert, setSelectedVariableInsert] = useState<BotVariable | null>(null);


    const handleOpenDialog = useCallback(() => {
        setOpen(true);
    }, []);
    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleInsert = useCallback(() => {
        if (isNil(selectedVariableInsert)) {
            throw new Error('InvalidOperationError');
        }

        onInsertVariable(selectedVariableInsert);
        handleClose();
        setSelectedVariableInsert(null);
        
    }, [handleClose, onInsertVariable, selectedVariableInsert]);

    const handleVariableChange = useCallback((selectedVariable: BotVariable) => {
        setSelectedVariableInsert(selectedVariable);
    }, []);


    return (
        <>
            <IconButton aria-label="edit-variable" onClick={handleOpenDialog}>
                <AbcIcon />
            </IconButton>
            <SmhDialog
                onClose={handleClose}
                maxWidth={'sm'}
                buttons={[
                    <Button key={'insert'} onClick={handleInsert} variant='contained' color='success' disabled={selectedVariableInsert === null}>Insert</Button>,
                    <Button key={'close'} onClick={handleClose}>Close</Button>
                ]}
                open={open} title={'Insert variable'}>
                <Box sx={{ marginBottom: 2 }}>
                    <Typography sx={{ marginBottom: 2 }}> Please select variable to insert:</Typography>
                    <VariableSelector valueId={selectedVariableInsert?.id ?? ''} onVariableChange={handleVariableChange} />
                </Box>
            </SmhDialog >
        </>
    )
}
