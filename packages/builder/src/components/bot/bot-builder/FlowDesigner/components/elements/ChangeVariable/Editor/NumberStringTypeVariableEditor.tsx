import { BotVariable, ChangeNumberStringVariableWorkflow, VariableType } from '@kickoffbot.com/types';
import { Box, TextField } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useInsertVariableToText } from './useInsertVariableToText';
import { VariableSelectorDialog } from '../../../VariableSelectorDialog';
import { ConvertArrayOptionsDialog, ConvertArrayOptionsDialogResult } from './ConvertArrayOptionsDialog';
interface Props {
    workflow?: ChangeNumberStringVariableWorkflow;
    onWorkflowChange: (newWorkflow: ChangeNumberStringVariableWorkflow) => void;
}

export const NumberStringTypeVariableEditor = ({ workflow, onWorkflowChange }: Props) => {
    const [expression, setExpression] = useState<string>(workflow?.expression ?? '');
    const { handleInsertVariable, inputRef, updateSelectionStart } = useInsertVariableToText(expression, (newValue) => {
        setExpression(newValue);
        onWorkflowChange({ expression: newValue });
    });
    const [selectedVariable, setSelectedVariable] = useState<BotVariable | undefined>();
    const [showConvertArrayOptionsDialog, setShowConvertArrayOptionsDialog] = useState<boolean>(false);

    const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onWorkflowChange({ expression: event.target.value });
        setExpression(event.target.value);
    }, [onWorkflowChange]);

    const handleSelectVariable = useCallback((variable: BotVariable) => {
        if (variable.type === VariableType.ARRAY && (variable.arrayItemType === VariableType.NUMBER || variable.arrayItemType === VariableType.OBJECT)) {
            setSelectedVariable(variable);
            setShowConvertArrayOptionsDialog(true);
            return;
        }

        handleInsertVariable(variable);
    }, [handleInsertVariable]);

    const handleConvertArrayOptionsDialogClose = useCallback((result?: ConvertArrayOptionsDialogResult) => {
        if (result) {
            handleInsertVariable(selectedVariable!, result?.propertyName, result?.converter);
        }
        setShowConvertArrayOptionsDialog(false);
    }, [handleInsertVariable, selectedVariable])

    const handleCustomVariableFilter = useCallback((variable: BotVariable) => {
        if (variable.type === VariableType.NUMBER) {
            return true;
        }

        if (variable.type === VariableType.ARRAY) {
            return true;
        }

        return false;

    }, [])

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
                <VariableSelectorDialog onInsertVariable={handleSelectVariable} onCustomVariableFilter={handleCustomVariableFilter} supportPathForObject={true} availableVariableTypes={[VariableType.NUMBER, VariableType.ARRAY]} />
                {showConvertArrayOptionsDialog && selectedVariable && <ConvertArrayOptionsDialog variable={selectedVariable} onClose={handleConvertArrayOptionsDialogClose} />}
            </Box>
        </Box>
    )
}
