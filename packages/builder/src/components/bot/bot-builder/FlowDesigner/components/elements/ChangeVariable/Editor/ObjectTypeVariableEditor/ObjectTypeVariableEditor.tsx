import { ChangeObjectVariableDataSource, ChangeObjectVariableWorkflow, VariableType, VariableValueSource } from '@kickoffbot.com/types';
import { Box, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import React, { useCallback, useEffect } from 'react'
import { useInsertVariableToText } from '../useInsertVariableToText';
import { VariableSelectorDialog } from '../../../../VariableSelectorDialog';
import { VariableValueSourceComponent } from '../VariableValueSource';
import { InsertOrRemoveObjectProperty } from './InsertOrRemoveObjectProperty';

interface Props {
    workflow?: ChangeObjectVariableWorkflow;
    onWorkflowChange: (newWorkflow: ChangeObjectVariableWorkflow) => void;
    targetVariableValue: object | null;
}

export const ObjectTypeVariableEditor = ({ workflow, onWorkflowChange, targetVariableValue }: Props) => {
    const [workflowValue, setWorkFlowValue] = React.useState<ChangeObjectVariableWorkflow>(workflow ?? {} as ChangeObjectVariableWorkflow);
    const { handleInsertVariable, inputRef, updateSelectionStart } = useInsertVariableToText(workflowValue.json ?? '', (value) => {

        setWorkFlowValue({ ...workflowValue, json: value });
    });


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

    const handlePropertyChange = useCallback((propertyName: string) => {
        setWorkFlowValue({ ...workflowValue, propertyName: propertyName.replace('<%', '').replace('%>', '') });
    }, [workflowValue]);

    const handlePropertyValueChange = useCallback((value: string) => {
        setWorkFlowValue({ ...workflowValue, propertyValue: value });
    }, [workflowValue]);

    return (
        <Box>
            <RadioGroup sx={{ flex: 1 }} value={workflowValue.source} onChange={handleValueDataSourceChange}>
                {/* <FormControlLabel value={ChangeObjectVariableDataSource.JSON} control={<Radio />} label="JSON" /> */}
                <FormControlLabel value={ChangeObjectVariableDataSource.VARIABLE} control={<Radio />} label="Set value from variable" />
                <FormControlLabel value={ChangeObjectVariableDataSource.INSERT_PROPERTY} control={<Radio />} label="Insert property into object" />
                <FormControlLabel value={ChangeObjectVariableDataSource.REMOVE_PROPERTY} control={<Radio />} label="Remove property from object" />
            </RadioGroup>

            {workflowValue.source === ChangeObjectVariableDataSource.JSON && <Box sx={{ display: 'flex', marginTop: 2 }}>
                <TextField
                    label="JSON"
                    multiline
                    rows={8}
                    value={workflowValue.json ?? ''}
                    onChange={handleJSONValueChange}
                    sx={{ width: '100%' }}
                    inputRef={inputRef}
                    onSelect={updateSelectionStart}
                />
                <Box sx={{ marginLeft: 1 }}>
                    <VariableSelectorDialog onInsertVariable={handleInsertVariable} supportPathForObject={false} />
                </Box>
            </Box>}

            {workflowValue.source === ChangeObjectVariableDataSource.VARIABLE &&
                <VariableValueSourceComponent filterVariableType={VariableType.OBJECT} variableValueSource={workflowValue.variableSource} onVariableValueSourceChange={handleVariableValueSourceChange} />
            }
            {(workflowValue.source === ChangeObjectVariableDataSource.INSERT_PROPERTY || workflowValue.source === ChangeObjectVariableDataSource.REMOVE_PROPERTY) &&
                <InsertOrRemoveObjectProperty
                    operation={workflowValue.source}
                    targetVariableValue={targetVariableValue}
                    propertyName={workflowValue.propertyName}
                    propertyValue={workflowValue.propertyValue as string}
                    onPropertyChange={handlePropertyChange}
                    onPropertyValueChange={handlePropertyValueChange} />
            }
        </Box>
    )
}
