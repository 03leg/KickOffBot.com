import { AddValueToArrayDescription, ChangeArrayOperation, ChangeArrayVariableWorkflow, RemoveItemsFromArrayDescription, VariableType } from '@kickoffbot.com/types';
import { Box, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import React, { useCallback, useEffect } from 'react'
import { AddNewToArray } from './AddNewToArray';
import { RemoveItemsFromArray } from './RemoveItemsFromArray';

interface Props {
    firstItemOfArray: unknown;
    jsonTypeOfArrayItem: Omit<VariableType, VariableType.ARRAY>;
    workflow?: ChangeArrayVariableWorkflow;
    onWorkflowChange: (newWorkflow: ChangeArrayVariableWorkflow) => void;
}

export const ArrayTypeVariableEditor = ({ workflow, onWorkflowChange, jsonTypeOfArrayItem, firstItemOfArray }: Props) => {
    const [workflowValue, setWorkFlowValue] = React.useState<ChangeArrayVariableWorkflow>(workflow ?? {} as ChangeArrayVariableWorkflow);

    const handleArrayOperationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWorkFlowValue({ operation: event.target.value as ChangeArrayOperation });
    }

    useEffect(() => {
        onWorkflowChange(workflowValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workflowValue]);


    const handleAddDescriptionChange = useCallback((newValue: AddValueToArrayDescription) => {
        setWorkFlowValue({ ...workflowValue, addDescription: newValue });
    }, [workflowValue]);

    const handleSetDescriptionChange = useCallback((newValue: AddValueToArrayDescription) => {
        setWorkFlowValue({ ...workflowValue, setDescription: newValue });
    }, [workflowValue]);

    const handleRemoveDescriptionChange = useCallback((newValue: RemoveItemsFromArrayDescription) => {
        setWorkFlowValue({ ...workflowValue, removeDescription: newValue });
    }, [workflowValue]);

    return (
        <Box sx={{ marginTop: 2 }}>
            <RadioGroup value={workflowValue.operation} onChange={handleArrayOperationChange}>
                <FormControlLabel value={ChangeArrayOperation.Add} control={<Radio />} label="Add items to array" />
                <FormControlLabel value={ChangeArrayOperation.Set} control={<Radio />} label="Set new value" />
                <FormControlLabel value={ChangeArrayOperation.Remove} control={<Radio />} label="Remove items" />
            </RadioGroup>
            {workflowValue.operation === ChangeArrayOperation.Add && <AddNewToArray jsonTypeOfArrayItem={jsonTypeOfArrayItem} value={workflowValue.addDescription} onValueChange={handleAddDescriptionChange} />}
            {workflowValue.operation === ChangeArrayOperation.Set && <AddNewToArray jsonTypeOfArrayItem={jsonTypeOfArrayItem} value={workflowValue.setDescription} onValueChange={handleSetDescriptionChange} />}
            {workflowValue.operation === ChangeArrayOperation.Remove && <RemoveItemsFromArray itemOfArray={firstItemOfArray} value={workflowValue.removeDescription} onValueChange={handleRemoveDescriptionChange} />}
        </Box>
    )
}
