/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { AvailableDateTimes, BotVariable, TimeDurationUnit, VariableType, WebInputDateTimeUIElement } from '@kickoffbot.com/types';
import { Box, Checkbox, FormControlLabel, Grid, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { VariableSelector } from '../../../../VariableSelector';
import { useWebDateTimeInputEditorStyles } from './WebDateTimeInputEditor.style';
import { MenuTextField } from '~/components/commons/MenuTextField';

interface Props {
    element: WebInputDateTimeUIElement;
}

export const WebDateTimeInputEditor = ({ element }: Props) => {
    const [dateTimeFormat, setDateTimeFormat] = React.useState(element.dateTimeFormat ?? '');
    const [useTime, setUseTime] = React.useState<boolean>(element.useTime);
    const [useAmPm, setUseAmPm] = React.useState<boolean>(element.useAmPm ?? false);
    const [availableDateTimes, setAvailableDateTimes] = React.useState<AvailableDateTimes>(element.availableDateTimes);
    const [selectedVariableId, setSelectedVariableId] = useState<string | undefined>(element.variableId);
    const [parkTimeVariableId, setParkTimeVariableId] = useState<string | undefined>(element.parkTimeVariableId);
    const [availableDateTimesVariableId, setAvailableDateTimesVariableId] = useState<string | undefined>(element.availableDateTimesVariableId);
    const [disabledDatesVariableId, setDisabledDatesVariableId] = useState<string | undefined>(element.disabledDatesVariableId);
    const [disabledTimesVariableId, setDisabledTimesVariableId] = useState<string | undefined>(element.disabledTimesVariableId);
    const [disabledDateAndTimesVariableId, setDisabledDateAndTimesVariableId] = useState<string | undefined>(element.disabledDateAndTimesVariableId);
    const { classes } = useWebDateTimeInputEditorStyles();
    const [parkTimeType, setParkTimeType] = React.useState<TimeDurationUnit>(element.parkTimeType ?? TimeDurationUnit.MINUTES);
    const [maxTime, setMaxTime] = React.useState<undefined | string>(element.maxTime ?? '');
    const [minTime, setMinTime] = React.useState<undefined | string>(element.minTime ?? '');
    const [maxDate, setMaxDate] = React.useState<undefined | string>(element.maxDate ?? '');
    const [minDate, setMinDate] = React.useState<undefined | string>(element.minDate ?? '');
    const [minutesStep, setMinutesStep] = React.useState<number | undefined>(element.minutesStep);
    const [disableDaysOfWeek, setDisableDaysOfWeek] = React.useState<boolean>(element.disableDaysOfWeek ?? false);
    const [disabledDaysOfWeek, setDisabledDaysOfWeek] = React.useState<number[]>(element.disabledDaysOfWeek ?? []);

    const handleDateTimeFormatChange = useCallback((value: string) => {
        setDateTimeFormat(value);
        element.dateTimeFormat = value;
    }, [element])

    const handleAvailableDateTimesChange = useCallback((event: SelectChangeEvent) => {
        setAvailableDateTimes(event.target.value as AvailableDateTimes);
        element.availableDateTimes = event.target.value as AvailableDateTimes;
    }, [element]);

    const handleParkTimeTypeChange = useCallback((event: SelectChangeEvent) => {
        setParkTimeType(event.target.value as TimeDurationUnit);
        element.parkTimeType = event.target.value as TimeDurationUnit;
    }, [element]);

    const handleVariableChange = useCallback((newVariable?: BotVariable) => {
        setSelectedVariableId(newVariable?.id);
        element.variableId = newVariable?.id;
    }, [element]);

    const handleAvailableDateVariableChange = useCallback((newVariable?: BotVariable) => {
        setAvailableDateTimesVariableId(newVariable?.id);
        element.availableDateTimesVariableId = newVariable?.id;
    }, [element]);

    const handleParkTimeVariableChange = useCallback((newVariable?: BotVariable) => {
        setParkTimeVariableId(newVariable?.id);
        element.parkTimeVariableId = newVariable?.id;
    }, [element]);

    const handleDisabledDatesVariableIdChange = useCallback((newVariable?: BotVariable) => {
        setDisabledDatesVariableId(newVariable?.id);
        element.disabledDatesVariableId = newVariable?.id;
    }, [element]);

    const handleDisabledTimesVariableIdChange = useCallback((newVariable?: BotVariable) => {
        setDisabledTimesVariableId(newVariable?.id);
        element.disabledTimesVariableId = newVariable?.id;
    }, [element]);

    const handleDisabledDateAndTimesVariableIdChange = useCallback((newVariable?: BotVariable) => {
        setDisabledDateAndTimesVariableId(newVariable?.id);
        element.disabledDateAndTimesVariableId = newVariable?.id;
    }, [element]);

    const handleUseTimeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setUseTime(event.target.checked);
        element.useTime = event.target.checked
    }, [element]);

    const handleAmPmChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setUseAmPm(event.target.checked);
        element.useAmPm = event.target.checked
    }, [element]);

    const handleMaxTimeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value === "" ? undefined : event.target.value;

        setMaxTime(newValue);
        element.maxTime = newValue;
    }, [element]);

    const handleMaxDateChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value === "" ? undefined : event.target.value;

        setMaxDate(newValue);
        element.maxDate = newValue;
    }, [element]);

    const handleMinDateChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value === "" ? undefined : event.target.value;

        setMinDate(newValue);
        element.minDate = newValue;
    }, [element]);

    const handleMinTimeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value === "" ? undefined : event.target.value;

        setMinTime(newValue);
        element.minTime = newValue;
    }, [element]);

    const handleMinutesStepChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value === '' ? undefined : Number(event.target.value);

        setMinutesStep(newValue);
        element.minutesStep = newValue;
    }, [element]);

    const formats = useMemo(() => {
        if (useTime) {
            return [
                { "label": "YYYY-MM-DD HH:MM:SS, Example: 2024-08-20 14:30:00", "value": "YYYY-MM-DD HH:mm:ss" },
                { "label": "MM/DD/YYYY HH:MM AM/PM, Example: 08/20/2024 2:30 PM", "value": "MM/DD/YYYY h:mm A" },
                { "label": "DD/MM/YYYY HH:MM, Example: 20/08/2024 14:30", "value": "DD/MM/YYYY HH:mm" },
                { "label": "YYYY/MM/DD HH:MM, Example: 2024/08/20 14:30", "value": "YYYY/MM/DD HH:mm" },
                { "label": "YYYY.MM.DD HH:MM, Example: 2024.08.20 14:30", "value": "YYYY.MM.DD HH:mm" },
                { "label": "Month DD, YYYY HH:MM AM/PM, Example: August 20, 2024 2:30 PM", "value": "MMMM DD, YYYY h:mm A" },
                { "label": "DD-MM-YYYY HH:MM, Example: 20-08-2024 14:30", "value": "DD-MM-YYYY HH:mm" },
                { "label": "YYYY Month DD HH:MM AM/PM, Example: 2024 August 20 2:30 PM", "value": "YYYY MMMM DD h:mm A" },
                { "label": "Day Month YYYY HH:MM AM/PM, Example: 20 August 2024 2:30 PM", "value": "DD MMMM YYYY h:mm A" }
            ];
        }

        return [
            { "label": "YYYY-MM-DD, Example: 2024-08-20", "value": "YYYY-MM-DD" },
            { "label": "MM/DD/YYYY, Example: 08/20/2024", "value": "MM/DD/YYYY" },
            { "label": "DD/MM/YYYY, Example: 20/08/2024", "value": "DD/MM/YYYY" },
            { "label": "YYYY/MM/DD, Example: 2024/08/20", "value": "YYYY/MM/DD" },
            { "label": "YYYY.MM.DD, Example: 2024.08.20", "value": "YYYY.MM.DD" },
            { "label": "Month DD, YYYY, Example: August 20, 2024", "value": "MMMM DD, YYYY" },
            { "label": "DD-MM-YYYY, Example: 20-08-2024", "value": "DD-MM-YYYY" },
            { "label": "YYYY Month DD, Example: 2024 August 20", "value": "YYYY MMMM DD" },
            { "label": "Day Month YYYY, Example: 20 August 2024", "value": "DD MMMM YYYY" },

        ]
    }, [useTime]);

    const handleDisableDaysOfWeekChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setDisableDaysOfWeek(event.target.checked);
        element.disableDaysOfWeek = event.target.checked;
    }, [element]);

    const handleDisabledDaysOfWeekChange = useCallback((value: boolean, day: number) => {
        let newValue = [...disabledDaysOfWeek];
        if (value) {
            newValue.push(day);
        } else {
            newValue = newValue.filter(item => item !== day);
        }

        setDisabledDaysOfWeek(newValue);
        element.disabledDaysOfWeek = newValue;
    }, [disabledDaysOfWeek, element]);

    return (
        <Box>
            <FormControlLabel control={<Checkbox checked={useTime} onChange={handleUseTimeChange} />} label="+ Time" />


            <>
                {useTime && <FormControlLabel control={<Checkbox checked={useAmPm} onChange={handleAmPmChange} />} label="Use AM/PM" />}
                <Grid container spacing={2}>
                    {useTime && <Grid item sm={6}>
                        <Typography className={classes.editorTitle}>Max time:</Typography>
                        <TextField placeholder='e.g. 18:00, or 06:00 PM' fullWidth variant="outlined" value={maxTime} onChange={handleMaxTimeChange} />
                        <Typography className={classes.editorTitle}>Min time:</Typography>
                        <TextField fullWidth placeholder='e.g. 09:00, or 09:00 AM' variant="outlined" value={minTime} onChange={handleMinTimeChange} />
                        <Typography className={classes.editorTitle}>Minutes step:</Typography>
                        <TextField fullWidth placeholder='e.g. 30, or 15' variant="outlined" type="number" value={minutesStep} onChange={handleMinutesStepChange} />
                    </Grid>}
                    <Grid item sm={6}>
                        <Typography className={classes.editorTitle}>Max date:</Typography>
                        <TextField placeholder='Use date time in selected format...' fullWidth variant="outlined" value={maxDate} onChange={handleMaxDateChange} />
                        <Typography className={classes.editorTitle}>Min date:</Typography>
                        <TextField fullWidth placeholder='Use date time in selected format...' variant="outlined" value={minDate} onChange={handleMinDateChange} />
                    </Grid>
                </Grid>
            </>

            {([AvailableDateTimes.FutureDates, AvailableDateTimes.FutureDatesAndToday, AvailableDateTimes.DatesFromVariable].includes(availableDateTimes)) && <>
                <Typography className={classes.editorTitle}>The time required to fit without interfering with unavailable time:</Typography>
                <Box className={classes.parkTimeContainer}>
                    <Box className={classes.variableSelectorContainer}>
                        <VariableSelector showResetButton={true} valueId={parkTimeVariableId} variableTypes={[VariableType.NUMBER]} onVariableChange={handleParkTimeVariableChange} />
                    </Box>
                    <Select
                        fullWidth
                        value={parkTimeType}
                        onChange={handleParkTimeTypeChange}
                        className={classes.parkTimeTypeSelector}
                    >
                        <MenuItem value={TimeDurationUnit.MINUTES}>Minutes</MenuItem>
                        <MenuItem value={TimeDurationUnit.HOURS}>Hours</MenuItem>
                        <MenuItem value={TimeDurationUnit.DAYS}>Days</MenuItem>
                    </Select>
                </Box>
            </>}

            <Typography className={classes.editorTitle}>Format:</Typography>
            <MenuTextField value={dateTimeFormat} onChange={handleDateTimeFormatChange} dataSource={formats} />
            <Typography className={classes.editorTitle}>Availability:</Typography>
            <Select
                fullWidth
                value={availableDateTimes}
                onChange={handleAvailableDateTimesChange}
            >
                <MenuItem value={AvailableDateTimes.All}>All</MenuItem>
                <MenuItem value={AvailableDateTimes.FutureDates}>Only future</MenuItem>
                <MenuItem value={AvailableDateTimes.PastDates}>Only past</MenuItem>
                <MenuItem value={AvailableDateTimes.FutureDatesAndToday}>Today + future</MenuItem>
                <MenuItem value={AvailableDateTimes.PastDatesAndToday}>Today + past</MenuItem>
                <MenuItem value={AvailableDateTimes.DatesFromVariable}>From variable</MenuItem>
            </Select>

            {availableDateTimes === AvailableDateTimes.DatesFromVariable &&
                <Box sx={{ ml: 4 }}>
                    <Typography className={classes.editorTitle}>Select variable:</Typography>
                    <Box className={classes.variableSelector}>
                        <VariableSelector showResetButton={true} valueId={availableDateTimesVariableId} variableTypes={[VariableType.ARRAY]} onVariableChange={handleAvailableDateVariableChange} />
                    </Box>
                </Box>
            }

            {availableDateTimes !== AvailableDateTimes.DatesFromVariable &&
                <>
                    <Box sx={{ ml: 4 }}>
                        <Typography className={classes.editorTitle}>Disabled dates:</Typography>
                        <Box className={classes.variableSelector}>
                            <VariableSelector showResetButton={true} valueId={disabledDatesVariableId} variableTypes={[VariableType.ARRAY]} onVariableChange={handleDisabledDatesVariableIdChange} />
                        </Box>
                    </Box>
                    {useTime &&
                        <>
                            <Box sx={{ ml: 4 }}>
                                <Typography className={classes.editorTitle}>Disabled times (e.g. 18:00 or 06:00 PM):</Typography>
                                <Box className={classes.variableSelector}>
                                    <VariableSelector showResetButton={true} valueId={disabledTimesVariableId} variableTypes={[VariableType.ARRAY]} onVariableChange={handleDisabledTimesVariableIdChange} />
                                </Box>
                            </Box>
                            <Box sx={{ ml: 4 }}>
                                <Typography className={classes.editorTitle}>Disabled date+times:</Typography>
                                <Box className={classes.variableSelector}>
                                    <VariableSelector showResetButton={true} valueId={disabledDateAndTimesVariableId} variableTypes={[VariableType.ARRAY]} onVariableChange={handleDisabledDateAndTimesVariableIdChange} />
                                </Box>
                            </Box>
                        </>}
                </>
            }

            <FormControlLabel control={<Checkbox checked={disableDaysOfWeek} onChange={handleDisableDaysOfWeekChange} />} label="Disable days of the week" />

            {disableDaysOfWeek &&
                <Box>
                    <FormControlLabel control={<Checkbox checked={disabledDaysOfWeek.includes(1)} onChange={(event: React.ChangeEvent<HTMLInputElement>) => (handleDisabledDaysOfWeekChange(event.target.checked, 1))} />} label="Mon" />
                    <FormControlLabel control={<Checkbox checked={disabledDaysOfWeek.includes(2)} onChange={(event: React.ChangeEvent<HTMLInputElement>) => (handleDisabledDaysOfWeekChange(event.target.checked, 2))} />} label="Tue" />
                    <FormControlLabel control={<Checkbox checked={disabledDaysOfWeek.includes(3)} onChange={(event: React.ChangeEvent<HTMLInputElement>) => (handleDisabledDaysOfWeekChange(event.target.checked, 3))} />} label="Wed" />
                    <FormControlLabel control={<Checkbox checked={disabledDaysOfWeek.includes(4)} onChange={(event: React.ChangeEvent<HTMLInputElement>) => (handleDisabledDaysOfWeekChange(event.target.checked, 4))} />} label="Thu" />
                    <FormControlLabel control={<Checkbox checked={disabledDaysOfWeek.includes(5)} onChange={(event: React.ChangeEvent<HTMLInputElement>) => (handleDisabledDaysOfWeekChange(event.target.checked, 5))} />} label="Fri" />
                    <FormControlLabel control={<Checkbox checked={disabledDaysOfWeek.includes(6)} onChange={(event: React.ChangeEvent<HTMLInputElement>) => (handleDisabledDaysOfWeekChange(event.target.checked, 6))} />} label="Sat" />
                    <FormControlLabel control={<Checkbox checked={disabledDaysOfWeek.includes(0)} onChange={(event: React.ChangeEvent<HTMLInputElement>) => (handleDisabledDaysOfWeekChange(event.target.checked, 0))} />} label="Sun" />
                </Box>
            }



            <Typography className={classes.editorTitle}>Select variable to save user input:</Typography>
            <Box className={classes.variableSelector}>
                <VariableSelector showResetButton={true} valueId={selectedVariableId} variableTypes={[VariableType.STRING, VariableType.DATE_TIME]} onVariableChange={handleVariableChange} />
            </Box>
        </Box>
    )
}
