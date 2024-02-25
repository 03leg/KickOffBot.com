import { ChangeNumberStringVariableWorkflow } from '@kickoffbot.com/types';
import { Box, TextField } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useInsertVariableToText } from './useInsertVariableToText';
import { VariableSelectorDialog } from '../../../VariableSelectorDialog';
interface Props {
    workflow?: ChangeNumberStringVariableWorkflow;
    onWorkflowChange: (newWorkflow: ChangeNumberStringVariableWorkflow) => void;
}

export const NumberStringTypeVariableEditor = ({ workflow, onWorkflowChange }: Props) => {
    const [expression, setExpression] = useState<string>(workflow?.expression ?? '');
    const { handleInsertVariable, inputRef, updateSelectionStart } = useInsertVariableToText(expression, (newValue)=>setExpression(newValue));

    const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onWorkflowChange({ expression: event.target.value });
        setExpression(event.target.value);
    }, [onWorkflowChange]);

    return (
        <Box sx={{ display: 'flex', marginTop: 2 }}>
            <TextField
                label="New value"
                multiline
                rows={8}
                value={expression}
                onChange={handleValueChange}
                sx={{ width: '100%' }}
                inputRef={inputRef}
                onSelect={updateSelectionStart}
            />
            <Box sx={{ marginLeft: 1 }}>
                <VariableSelectorDialog onInsertVariable={handleInsertVariable} />
            </Box>
        </Box>
    )
}
