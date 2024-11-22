import { ChangeDateTimeDurationType, ChangeDateTimeVariableOperation, ChangeDateTimeVariableWorkflow } from '@kickoffbot.com/types';
import { Box, FormControlLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent } from '@mui/material';
import React, { useCallback, useEffect } from 'react'
import { useDateTimeTypeVariableEditorStyles } from './DateTimeTypeVariableEditor.style';
import { AppTextField } from '~/components/commons/AppTextField';

interface Props {
    workflow?: ChangeDateTimeVariableWorkflow;
    onWorkflowChange: (newWorkflow: ChangeDateTimeVariableWorkflow) => void;
}


export const DateTimeTypeVariableEditor = ({ onWorkflowChange, workflow }: Props) => {
    const { classes } = useDateTimeTypeVariableEditorStyles();
    const [operation, setOperation] = React.useState(workflow?.operation ?? ChangeDateTimeVariableOperation.SET_NEW_VALUE);
    const [newValue, setNewValue] = React.useState(workflow?.newValue ?? '');
    const [duration, setDuration] = React.useState(workflow?.duration ?? '');
    const [durationType, setDurationType] = React.useState(workflow?.durationType ?? ChangeDateTimeDurationType.Mins);

    useEffect(() => {
        onWorkflowChange({ operation, newValue, duration, durationType });
    }, [duration, durationType, newValue, onWorkflowChange, operation])

    const handleDurationChange = useCallback((newValue: string) => {
        setDuration(newValue);
    }, []);

    const handleOperationChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setOperation(event.target.value as ChangeDateTimeVariableOperation);
    }, []);

    const handleNewValueChange = useCallback((newValue: string) => {
        setNewValue(newValue);
    }, []);

    const handleDurationTypeChange = useCallback((event: SelectChangeEvent) => {
        setDurationType(event.target.value as ChangeDateTimeDurationType);
    }, []);

    return (
        <Box className={classes.root}>

            <RadioGroup sx={{ flex: 1 }} value={operation} onChange={handleOperationChange}>
                <FormControlLabel value={ChangeDateTimeVariableOperation.SET_NEW_VALUE} control={<Radio />} label="Set new value" />
                <FormControlLabel value={ChangeDateTimeVariableOperation.ADD_DURATION} control={<Radio />} label="Add duration to date time" />
                <FormControlLabel value={ChangeDateTimeVariableOperation.REMOVE_DURATION} control={<Radio />} label="Remove duration from date time" />
            </RadioGroup>

            <Box className={classes.valueEditors}>
                {operation === ChangeDateTimeVariableOperation.SET_NEW_VALUE &&
                    <AppTextField label="New value" value={newValue} onValueChange={handleNewValueChange} />
                }
                {(operation === ChangeDateTimeVariableOperation.ADD_DURATION || operation === ChangeDateTimeVariableOperation.REMOVE_DURATION) &&
                    <Box className={classes.durationContainer}>
                        <AppTextField label="Duration" value={duration} onValueChange={handleDurationChange} />
                        <Select
                            fullWidth
                            value={durationType}
                            onChange={handleDurationTypeChange}
                            className={classes.durationTypeSelect}
                        >
                            <MenuItem value={ChangeDateTimeDurationType.Mins}>Minutes</MenuItem>
                            <MenuItem value={ChangeDateTimeDurationType.Hours}>Hours</MenuItem>
                            <MenuItem value={ChangeDateTimeDurationType.Days}>Days</MenuItem>
                        </Select>
                    </Box>
                }
            </Box>
        </Box>
    )
}
