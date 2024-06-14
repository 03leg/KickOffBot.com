import { BotVariable, HttpHeader, VariableType } from '@kickoffbot.com/types';
import { Box, IconButton, TextField } from '@mui/material'
import React, { useCallback } from 'react'
import { VariableSelectorDialog } from '../../../VariableSelectorDialog';
import { useInsertVariableToText } from '../../ChangeVariable/Editor/useInsertVariableToText';
import DeleteIcon from '@mui/icons-material/Delete';


interface Props {
    header: HttpHeader;
    onDelete: (header: HttpHeader) => void;
}

export const CustomHeader = ({ header, onDelete }: Props) => {

    const [headerLocal, setHeaderLocal] = React.useState<string>(header.header);
    const [valueLocal, setValueLocal] = React.useState<string>(header.value);

    const { handleInsertVariable, inputRef, updateSelectionStart } = useInsertVariableToText(valueLocal, (newValue) => {
        setValueLocal(newValue);
        header.value = newValue;
    });

    const handleHeaderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setHeaderLocal(event.target.value);
        header.header = event.target.value;
    }, [header]);

    const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValueLocal(event.target.value);
        header.value = event.target.value;
    }, [header]);


    const handleSelectVariable = useCallback((variable: BotVariable) => {
        handleInsertVariable(variable);
    }, [handleInsertVariable]);

    const handleRemoveHeader = useCallback(() => {
        onDelete(header);
    }, [onDelete, header]);


    return (
        <Box sx={{ display: 'flex', mb: 1, alignItems: 'center' }}>
            <TextField sx={{ mr: 1 }} fullWidth variant="outlined" required label="Header" value={headerLocal} onChange={handleHeaderChange} />
            <TextField sx={{ mr: 1 }} fullWidth variant="outlined" required label="Value" value={valueLocal} onChange={handleValueChange} inputRef={inputRef}
                onSelect={updateSelectionStart} />
            <VariableSelectorDialog onInsertVariable={handleSelectVariable} supportPathForObject={true} availableVariableTypes={[VariableType.NUMBER, VariableType.STRING, VariableType.BOOLEAN]} />
            <IconButton sx={{ ml: 1 }} size='small' aria-label="delete" onClick={handleRemoveHeader}>
                <DeleteIcon />
            </IconButton>
        </Box>
    )
}
