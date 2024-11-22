import { TimeDurationUnit, TimeSlotsGeneratorDescription, ValueReference, VariableType } from '@kickoffbot.com/types';
import { Box, Grid, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { AppTextField } from '~/components/commons/AppTextField';
import { AppValueReference } from '~/components/commons/AppValueReference';

interface Props {
  value?: TimeSlotsGeneratorDescription;
  onValueChange: (value: TimeSlotsGeneratorDescription) => void;
}

export const TimeSlotsFunctionDescriptionComponent = ({ value, onValueChange }: Props) => {

  const handleStartTimeChange = useCallback((newValue?: ValueReference) => {
    onValueChange({ ...(value ?? ({} as TimeSlotsGeneratorDescription)), startTimeRef: newValue });
  }, [onValueChange, value]);

  const handleEndTimeChange = useCallback((newValue?: ValueReference) => {
    onValueChange({ ...(value ?? ({} as TimeSlotsGeneratorDescription)), endTimeRef: newValue });
  }, [onValueChange, value]);

  const handleSlotDurationUnitChange = useCallback((event: SelectChangeEvent) => {
    onValueChange({ ...(value ?? ({} as TimeSlotsGeneratorDescription)), slotDurationUnit: event.target.value as TimeDurationUnit });
  }, [onValueChange, value]);

  const handleSlotDurationChange = useCallback((newValue: string) => {
    onValueChange({ ...(value ?? ({} as TimeSlotsGeneratorDescription)), slotDuration: newValue });
  }, [onValueChange, value]);

  return (<Box>
    <Grid container spacing={2} sx={{ marginTop: 1, }}>
      <Grid item sm={6} >
        <Typography>Start time:</Typography>
        <AppValueReference value={value?.startTimeRef} onValueReferenceChange={handleStartTimeChange} onCustomVariableFilter={variable => variable.type === VariableType.DATE_TIME} />
      </Grid>
      <Grid item sm={6}>
        <Typography>Finish time:</Typography>
        <AppValueReference value={value?.endTimeRef} onValueReferenceChange={handleEndTimeChange} onCustomVariableFilter={variable => variable.type === VariableType.DATE_TIME} />
      </Grid>
    </Grid>

    <Typography sx={{ marginTop: 1, }}>Slot duration:</Typography>
    <Box sx={{
      display: "flex",
    }}>


      <AppTextField value={value?.slotDuration ?? ""} onValueChange={handleSlotDurationChange} />

      <Select
        fullWidth
        value={value?.slotDurationUnit ?? TimeDurationUnit.MINUTES}
        onChange={handleSlotDurationUnitChange}
        sx={{
          marginLeft: 1,
          width: "auto",
        }}
      // className={classes.parkTimeTypeSelector}
      >
        <MenuItem value={TimeDurationUnit.MINUTES}>Minutes</MenuItem>
        <MenuItem value={TimeDurationUnit.HOURS}>Hours</MenuItem>
        <MenuItem value={TimeDurationUnit.DAYS}>Days</MenuItem>
      </Select>
    </Box>
  </Box >
  );
}
