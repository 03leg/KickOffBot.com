import React, { useCallback, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { useDateTimeBoxRequestStyles } from './DateTimeBoxRequest.style';
import { AvailableDateTimes, DateTimeRequestElement, RequestDescriptionWebRuntime } from '@kickoffbot.com/types';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, DateTimeValidationError, TimeView } from '@mui/x-date-pickers';
import { SendResponseButton } from '../SendResponseButton';
import { throwIfNil } from '../../../../utils/guard';


interface Props {
    request: RequestDescriptionWebRuntime;
}

export const DateTimeBoxRequest = ({ request }: Props) => {
    const dateTimeElement = request.element as DateTimeRequestElement;
    const { classes } = useDateTimeBoxRequestStyles();
    const [dateValue, setDateValue] = useState<Dayjs | null>(null);
    const [error, setError] = useState<DateTimeValidationError | null>(null);

    const handleSendResponse = useCallback(() => {
        throwIfNil(request.onResponse);

        request.onResponse({ data: dateValue?.format(dateTimeElement.dateTimeFormat) })
    }, [dateTimeElement.dateTimeFormat, dateValue, request]);


    const buttonSendDisabled = useMemo(() => {
        return error !== null || dateValue === null;
    }, [dateValue, error]);

    const handleDateValueChange = useCallback((newValue: Dayjs | null) => {
        setDateValue(newValue);
    }, []);

    const minDate = useMemo(() => {
        if (dateTimeElement.availableDateTimes === AvailableDateTimes.FutureDatesAndToday) {
            return dayjs(new Date());
        }

        if (dateTimeElement.availableDateTimes === AvailableDateTimes.FutureDates) {
            return dayjs(new Date()).add(1, 'day');
        }

        return undefined;

    }, [dateTimeElement.availableDateTimes]);

    const maxDate = useMemo(() => {
        if (dateTimeElement.availableDateTimes === AvailableDateTimes.PastDatesAndToday) {
            return dayjs(new Date());
        }

        if (dateTimeElement.availableDateTimes === AvailableDateTimes.PastDates) {
            return dayjs(new Date()).add(-1, 'day');
        }

        return undefined;

    }, [dateTimeElement.availableDateTimes]);

    const handleShouldDisableDate = useCallback((date: Dayjs): boolean => {
        if (dateTimeElement.availableDateTimes === AvailableDateTimes.DatesFromVariable && dateTimeElement.variableAvailableDateTimes) {
            const variableValue = dateTimeElement.variableAvailableDateTimes;
            const datesFromVariable = variableValue.map(d => dayjs(d, dateTimeElement.dateTimeFormat, false).format('YYYY-MM-DD'));
            const currentDate = date.format('YYYY-MM-DD');

            return !datesFromVariable.includes(currentDate);
        }

        return false;
    }, [dateTimeElement.availableDateTimes, dateTimeElement.variableAvailableDateTimes, dateTimeElement.dateTimeFormat]);

    const handleShouldDisableTime = useCallback((date: Dayjs, view: TimeView): boolean => {
        if (dateTimeElement.availableDateTimes === AvailableDateTimes.DatesFromVariable && dateTimeElement.variableAvailableDateTimes) {
            const variableValue = dateTimeElement.variableAvailableDateTimes;

            const actualFormat = view === 'hours' ? 'YYYY-MM-DD HH' : 'YYYY-MM-DD HH:mm';

            const datesFromVariable = variableValue.map(d => dayjs(d, dateTimeElement.dateTimeFormat, false).format(actualFormat));
            const currentDate = date.format(actualFormat);

            return !datesFromVariable.includes(currentDate);
        }

        return false;
    }, [dateTimeElement.availableDateTimes, dateTimeElement.variableAvailableDateTimes, dateTimeElement.dateTimeFormat]);

    const getMinMaxValue = useCallback((value: string) => {
        return dayjs('01/01/1970 ' + value, ["MM/DD/YYYY HH:mm", "MM/DD/YYYY h:mm", "MM/DD/YYYY hh:mm A", "MM/DD/YYYY h:mm A", "MM/DD/YYYY HH:mm"], true);
    }, [])

    const minTime = useMemo(() => {
        if (dateTimeElement.minTime) {
            const minValue = getMinMaxValue(dateTimeElement.minTime);

            return minValue;
        }

        return undefined;

    }, [dateTimeElement.minTime, getMinMaxValue]);

    const maxTime = useMemo(() => {
        if (dateTimeElement.maxTime) {
            const maxValue = getMinMaxValue(dateTimeElement.maxTime);

            return maxValue;
        }

        return undefined;

    }, [dateTimeElement.maxTime, getMinMaxValue]);

    return (
        <Box className={classes.root}>
            <Box className={classes.textField}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {!dateTimeElement.useTime && <DesktopDatePicker
                        className={classes.picker}
                        format={dateTimeElement.dateTimeFormat}
                        value={dateValue}
                        onChange={handleDateValueChange}
                        onError={setError}
                        minDate={minDate}
                        maxDate={maxDate}
                        shouldDisableDate={handleShouldDisableDate}
                    />}

                    {dateTimeElement.useTime && <DateTimePicker
                        className={classes.picker}
                        format={dateTimeElement.dateTimeFormat}
                        value={dateValue}
                        onChange={handleDateValueChange}
                        ampm={dateTimeElement.useAmPm ?? false}
                        onError={setError}
                        minDate={minDate}
                        maxDate={maxDate}
                        shouldDisableDate={handleShouldDisableDate}
                        minutesStep={dateTimeElement.minutesStep}
                        maxTime={maxTime}
                        minTime={minTime}
                        disableIgnoringDatePartForTimeValidation={false}
                        shouldDisableTime={handleShouldDisableTime}
                    />}
                </LocalizationProvider>
            </Box>
            <SendResponseButton onSendResponse={handleSendResponse} disabled={buttonSendDisabled} />
        </Box>
    )
}
