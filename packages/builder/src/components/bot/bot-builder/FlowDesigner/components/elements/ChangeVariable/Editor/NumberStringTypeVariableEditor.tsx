import { BotVariable, ChangeNumberStringVariableWorkflow, VariableType } from '@kickoffbot.com/types';
import { Box, TextField } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useInsertVariableToText } from './useInsertVariableToText';
import { VariableSelectorDialog } from '../../../VariableSelectorDialog';
import { ConvertArrayToNumberOptionsDialog, ConvertArrayOptionsDialogResult } from './ConvertArrayToNumberOptionsDialog';
import { ConvertArrayToStringOptionsDialog } from './ConvertArrayToStringOptionsDialog';
interface Props {
    targetVariableType: VariableType.NUMBER | VariableType.STRING;
    workflow?: ChangeNumberStringVariableWorkflow;
    onWorkflowChange: (newWorkflow: ChangeNumberStringVariableWorkflow) => void;
}

export const NumberStringTypeVariableEditor = ({ workflow, onWorkflowChange, targetVariableType }: Props) => {
    const [expression, setExpression] = useState<string>(workflow?.expression ?? '');
    const { handleInsertVariable, inputRef, updateSelectionStart } = useInsertVariableToText(expression, (newValue) => {
        setExpression(newValue);
        onWorkflowChange({ expression: newValue });
    });
    const [selectedVariable, setSelectedVariable] = useState<BotVariable | undefined>();
    const [showConvertArrayToNumberOptionsDialog, setShowConvertArrayToNumberOptionsDialog] = useState<boolean>(false);
    const [showConvertArrayToStringOptionsDialog, setShowConvertArrayToStringOptionsDialog] = useState<boolean>(false);

    const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onWorkflowChange({ expression: event.target.value });
        setExpression(event.target.value);
    }, [onWorkflowChange]);

    const handleSelectVariable = useCallback((variable: BotVariable, path?: string) => {
        if (variable.type === VariableType.ARRAY && targetVariableType === VariableType.NUMBER && (variable.arrayItemType === VariableType.NUMBER || variable.arrayItemType === VariableType.OBJECT)) {
            setSelectedVariable(variable);
            setShowConvertArrayToNumberOptionsDialog(true);
            return;
        }

        if (variable.type === VariableType.ARRAY && targetVariableType === VariableType.STRING && (variable.arrayItemType === VariableType.STRING || variable.arrayItemType === VariableType.OBJECT)) {
            setSelectedVariable(variable);
            setShowConvertArrayToStringOptionsDialog(true);
            return;
        }

        handleInsertVariable(variable, path);
    }, [handleInsertVariable, targetVariableType]);

    const handleConvertArrayToNumberOptionsDialogClose = useCallback((result?: ConvertArrayOptionsDialogResult) => {
        if (result) {
            handleInsertVariable(selectedVariable!, result?.propertyName, result?.converter);
        }
        setShowConvertArrayToNumberOptionsDialog(false);
    }, [handleInsertVariable, selectedVariable])

    const handleConvertArrayToStringOptionsDialogClose = useCallback((result?: ConvertArrayOptionsDialogResult) => {
        if (result) {
            handleInsertVariable(selectedVariable!, result?.propertyName, result?.converter, result?.params);
        }
        setShowConvertArrayToStringOptionsDialog(false);
    }, [handleInsertVariable, selectedVariable])

    const handleCustomVariableFilter = useCallback((variable: BotVariable) => {
        if ([VariableType.NUMBER, VariableType.ARRAY, VariableType.STRING, VariableType.OBJECT].includes(variable.type)) {
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
                <VariableSelectorDialog onInsertVariable={handleSelectVariable} onCustomVariableFilter={handleCustomVariableFilter} supportPathForObject={true} />
                {showConvertArrayToNumberOptionsDialog && selectedVariable && <ConvertArrayToNumberOptionsDialog variable={selectedVariable} onClose={handleConvertArrayToNumberOptionsDialogClose} />}
                {showConvertArrayToStringOptionsDialog && selectedVariable && <ConvertArrayToStringOptionsDialog variable={selectedVariable} onClose={handleConvertArrayToStringOptionsDialogClose} />}
            </Box>
        </Box>
    )
}
