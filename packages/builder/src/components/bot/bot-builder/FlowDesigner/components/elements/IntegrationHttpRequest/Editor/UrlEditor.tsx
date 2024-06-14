import { Box, TextField } from '@mui/material'
import React, { useCallback } from 'react'
import { useInsertVariableToText } from '../../ChangeVariable/Editor/useInsertVariableToText';
import { VariableSelectorDialog } from '../../../VariableSelectorDialog';
import { BotVariable, VariableType } from '@kickoffbot.com/types';

interface Props {
    url: string;
    onUrlChange: (url: string) => void;
}

export const UrlEditor = ({ url, onUrlChange }: Props) => {
    const handleUrlChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onUrlChange(event.target.value)
    }, [onUrlChange]);

    const { handleInsertVariable, inputRef, updateSelectionStart } = useInsertVariableToText(url, (newValue) => {
        onUrlChange(newValue);
    });

    const handleSelectVariable = useCallback((variable: BotVariable) => {
        handleInsertVariable(variable);
    }, [handleInsertVariable]);

    return (
        <Box sx={{ flex: 1, ml: 1, display: 'flex', alignItems: 'center' }}>
            <TextField sx={{ mr: 1 }} fullWidth variant="outlined" required label="URL" value={url} onChange={handleUrlChange} inputRef={inputRef}
                onSelect={updateSelectionStart} />

            <VariableSelectorDialog onInsertVariable={handleSelectVariable} supportPathForObject={true} availableVariableTypes={[VariableType.NUMBER, VariableType.STRING]} />

        </Box>
    )
}
