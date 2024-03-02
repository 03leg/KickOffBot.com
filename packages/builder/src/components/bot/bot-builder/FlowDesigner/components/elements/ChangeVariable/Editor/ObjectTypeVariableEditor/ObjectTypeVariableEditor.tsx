import { BotVariable, ChangeObjectVariableDataSource, ChangeObjectVariableWorkflow, VariableType, VariableValueSource } from '@kickoffbot.com/types';
import { Box, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import React, { useCallback, useEffect } from 'react'
import { useInsertVariableToText } from '../useInsertVariableToText';
import { VariableSelectorDialog } from '../../../../VariableSelectorDialog';
import { VariableValueSourceComponent } from '../VariableValueSource';

interface Props {
    workflow?: ChangeObjectVariableWorkflow;
    onWorkflowChange: (newWorkflow: ChangeObjectVariableWorkflow) => void;

}

export const ObjectTypeVariableEditor = ({ workflow, onWorkflowChange }: Props) => {
    const [workflowValue, setWorkFlowValue] = React.useState<ChangeObjectVariableWorkflow>(workflow ?? {} as ChangeObjectVariableWorkflow);
    const { handleInsertVariable, inputRef, updateSelectionStart } = useInsertVariableToText(workflowValue.json ?? '', (value) => workflowValue.json = value);


    const handleValueDataSourceChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value) as ChangeObjectVariableDataSource;

        const newOject = { ...workflowValue, source: newValue };

        setWorkFlowValue(newOject);


    }, [workflowValue]);

    const handleJSONValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setWorkFlowValue({ ...workflowValue, json: event.target.value });
    }, [workflowValue]);

    useEffect(() => {
        onWorkflowChange(workflowValue);
    }, [workflowValue, onWorkflowChange]);

    const handleVariableValueSourceChange = useCallback((newValue: VariableValueSource) => {
        setWorkFlowValue({ ...workflowValue, variableSource: newValue });
    }, [workflowValue]);


    return (
        <Box>
            <RadioGroup sx={{ flex: 1 }} value={workflowValue.source} onChange={handleValueDataSourceChange}>
                <FormControlLabel value={ChangeObjectVariableDataSource.JSON} control={<Radio />} label="JSON" />
                <FormControlLabel value={ChangeObjectVariableDataSource.VARIABLE} control={<Radio />} label="Set value from variable" />
            </RadioGroup>

            {workflowValue.source === ChangeObjectVariableDataSource.JSON && <Box sx={{ display: 'flex', marginTop: 2 }}>
                <TextField
                    label="JSON"
                    multiline
                    rows={8}
                    value={workflowValue.json}
                    onChange={handleJSONValueChange}
                    sx={{ width: '100%' }}
                    inputRef={inputRef}
                    onSelect={updateSelectionStart}
                />
                <Box sx={{ marginLeft: 1 }}>
                    <VariableSelectorDialog onInsertVariable={handleInsertVariable} />
                </Box>
            </Box>}

            {workflowValue.source === ChangeObjectVariableDataSource.VARIABLE &&
                <VariableValueSourceComponent filterVariableType={VariableType.OBJECT} variableValueSource={workflowValue.variableSource} onVariableValueSourceChange={handleVariableValueSourceChange} />
            }
        </Box>
    )
}
