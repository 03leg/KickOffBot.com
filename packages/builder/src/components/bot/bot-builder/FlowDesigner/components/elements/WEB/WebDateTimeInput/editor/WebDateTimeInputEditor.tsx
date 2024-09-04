import { AvailableDateTimes, BotVariable, VariableType, WebInputDateTimeUIElement } from '@kickoffbot.com/types';
import { Box, Checkbox, FormControlLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
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
    const [selectedVariableId, setSelectedVariableId] = useState<string>(element.variableId ?? '');
    const [availableDateTimesVariableId, setAvailableDateTimesVariableId] = useState<string>(element.availableDateTimesVariableId ?? '');
    const { classes } = useWebDateTimeInputEditorStyles();
    const [maxTime, setMaxTime] = React.useState<undefined | string>(element.maxTime ?? '');
    const [minTime, setMinTime] = React.useState<undefined | string>(element.minTime ?? '');
    const [minutesStep, setMinutesStep] = React.useState<number | undefined>(element.minutesStep);

    const handleDateTimeFormatChange = useCallback((value: string) => {
        setDateTimeFormat(value);
        element.dateTimeFormat = value;
    }, [element])

    const handleAvailableDateTimesChange = useCallback((event: SelectChangeEvent) => {
        setAvailableDateTimes(event.target.value as AvailableDateTimes);
        element.availableDateTimes = event.target.value as AvailableDateTimes;
    }, [element]);

    const handleVariableChange = useCallback((newVariable: BotVariable) => {
        setSelectedVariableId(newVariable.id);
        element.variableId = newVariable.id;
    }, [element]);

    const handleAvailableDateVariableChange = useCallback((newVariable: BotVariable) => {
        setAvailableDateTimesVariableId(newVariable.id);
        element.availableDateTimesVariableId = newVariable.id;
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

    return (
        <Box>
            <FormControlLabel control={<Checkbox checked={useTime} onChange={handleUseTimeChange} />} label="+ Time" />

            {useTime &&
                <>
                    <FormControlLabel control={<Checkbox checked={useAmPm} onChange={handleAmPmChange} />} label="Use AM/PM" />
                    <Typography className={classes.editorTitle}>Max time:</Typography>
                    <TextField placeholder='e.g. 18:00, or 06:00 PM' fullWidth variant="outlined" value={maxTime} onChange={handleMaxTimeChange} />
                    <Typography className={classes.editorTitle}>Min time:</Typography>
                    <TextField fullWidth placeholder='e.g. 09:00, or 09:00 AM' variant="outlined" value={minTime} onChange={handleMinTimeChange} />
                    <Typography className={classes.editorTitle}>Minutes step:</Typography>
                    <TextField fullWidth placeholder='e.g. 30, or 15' variant="outlined" type="number" value={minutesStep} onChange={handleMinutesStepChange} />
                </>
            }

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
                <>
                    <Typography className={classes.editorTitle}>Select variable:</Typography>
                    <Box className={classes.variableSelector}>
                        <VariableSelector valueId={availableDateTimesVariableId} variableTypes={[VariableType.ARRAY]} onVariableChange={handleAvailableDateVariableChange} />
                    </Box>
                </>
            }

            <Typography className={classes.editorTitle}>Select variable to save user input:</Typography>
            <Box className={classes.variableSelector}>
                <VariableSelector valueId={selectedVariableId} variableTypes={[VariableType.STRING]} onVariableChange={handleVariableChange} />
            </Box>
        </Box>
    )
}
