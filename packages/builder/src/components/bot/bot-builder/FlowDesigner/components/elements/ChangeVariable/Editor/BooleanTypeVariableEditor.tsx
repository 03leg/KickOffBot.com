import { ChangeBooleanVariableWorkflow, ChangeBooleanVariableWorkflowStrategy } from '@kickoffbot.com/types';
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import React, { useCallback, useState } from 'react';

interface Props {
    workflow?: ChangeBooleanVariableWorkflow;
    onWorkflowChange: (newWorkflow: ChangeBooleanVariableWorkflow) => void;
}

export const BooleanTypeVariableEditor = ({ workflow, onWorkflowChange }: Props) => {
    const [value, setValue] = useState<ChangeBooleanVariableWorkflowStrategy | undefined>(workflow?.strategy);

    const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event.target.value));
        onWorkflowChange({ strategy: Number(event.target.value) as ChangeBooleanVariableWorkflowStrategy });
    }, [onWorkflowChange]);

    return (
        <Box sx={{ display: 'flex', marginTop: 2 }}>
            <FormControl >
                <FormLabel id="default-value-boolean-editor">New value</FormLabel>

                <RadioGroup value={value} onChange={handleValueChange}>
                    <FormControlLabel value={ChangeBooleanVariableWorkflowStrategy.SET_TRUE} control={<Radio />} label="True" />
                    <FormControlLabel value={ChangeBooleanVariableWorkflowStrategy.SET_FALSE} control={<Radio />} label="False" />
                    <FormControlLabel value={ChangeBooleanVariableWorkflowStrategy.TOGGLE} control={<Radio />} label="Toggle" />
                </RadioGroup>
            </FormControl>
        </Box>
    )
}
