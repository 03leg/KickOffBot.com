import { useCallback, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { useDateTimeBoxRequestStyles } from './DateTimeBoxRequest.style';
import { AvailableDateTimes, DateTimeRequestElement, RequestDescriptionWebRuntime, TimeDurationUnit } from '@kickoffbot.com/types';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, DateTimeValidationError, TimeView } from '@mui/x-date-pickers';
import { SendResponseButton } from '../SendResponseButton';
import { throwIfNil } from '../../../../utils/guard';
import { isNil } from 'lodash';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getParkTimeInMinutes } from './DateTimeBoxRequest.utils';


dayjs.extend(customParseFormat);

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
        if (dateTimeElement.minDate) {
            const result = dayjs(dateTimeElement.minDate, dateTimeElement.dateTimeFormat, false);
            return result;
        }

        if (dateTimeElement.availableDateTimes === AvailableDateTimes.FutureDatesAndToday) {
            return dayjs(new Date());
        }

        if (dateTimeElement.availableDateTimes === AvailableDateTimes.FutureDates) {
            return dayjs(new Date()).add(1, 'day');
        }

        return undefined;
    }, [dateTimeElement.availableDateTimes]);

    const maxDate = useMemo(() => {
        if (dateTimeElement.maxDate) {
            if (dateTimeElement.parkTime && dateTimeElement.parkTimeType === TimeDurationUnit.DAYS) {
                return dayjs(dateTimeElement.maxDate, dateTimeElement.dateTimeFormat, false).add(-dateTimeElement.parkTime, 'day');
            }

            return dayjs(dateTimeElement.maxDate, dateTimeElement.dateTimeFormat, false);
        }

        if (dateTimeElement.availableDateTimes === AvailableDateTimes.PastDatesAndToday) {
            return dayjs(new Date());
        }

        if (dateTimeElement.availableDateTimes === AvailableDateTimes.PastDates) {
            return dayjs(new Date()).add(-1, 'day');
        }

        return undefined;

    }, [dateTimeElement.availableDateTimes]);

    const handleShouldDisableDate = useCallback((dateArgument: Dayjs): boolean => {
        let result = false;

        if (dateTimeElement.disableDaysOfWeek && Array.isArray(dateTimeElement.disabledDaysOfWeek)) {
            result = dateTimeElement.disabledDaysOfWeek.includes(dateArgument.day());
        }

        if (result === false && dateTimeElement.availableDateTimes === AvailableDateTimes.DatesFromVariable && dateTimeElement.variableAvailableDateTimes) {
            const variableValue = dateTimeElement.variableAvailableDateTimes;
            const datesFromVariable = variableValue.map(d => dayjs(d, dateTimeElement.dateTimeFormat, false).format('YYYY-MM-DD'));
            const currentDate = dateArgument.format('YYYY-MM-DD');

            result = !datesFromVariable.includes(currentDate);
        }

        if (result === false && !isNil(dateTimeElement.disabledDates)) {
            result = dateTimeElement.disabledDates.map(d => dayjs(d, dateTimeElement.dateTimeFormat, false).format('YYYY-MM-DD')).includes(dateArgument.format('YYYY-MM-DD'));
        }

        if (result === false && !isNil(dateTimeElement.disabledDates) && dateTimeElement.parkTime && dateTimeElement.parkTimeType === TimeDurationUnit.DAYS) {
            const formatDate = 'YYYY-MM-DD' as const;
            let startDateTime = dateArgument;
            const timeStep = 1;

            while (dateTimeElement.parkTime > timeStep) {
                const currentSlotTime = startDateTime.add(timeStep, 'day');
                const formattedCurrentSlotDate = currentSlotTime.format(formatDate);

                const hasInDisabledDays = dateTimeElement.disabledDates.map(d => dayjs(d, dateTimeElement.dateTimeFormat, false).format('YYYY-MM-DD')).includes(formattedCurrentSlotDate);
                if (hasInDisabledDays) {
                    result = true;
                    break;
                }
            }
        }

        return result;
    }, [dateTimeElement.availableDateTimes, dateTimeElement.variableAvailableDateTimes, dateTimeElement.dateTimeFormat]);

    const handleShouldDisableTime = useCallback((dateTimeArgument: Dayjs, view: TimeView): boolean => {

        if ([AvailableDateTimes.FutureDates, AvailableDateTimes.PastDates].includes(dateTimeElement.availableDateTimes)
            && dateTimeArgument.format('YYYY-MM-DD') === dayjs(new Date()).format('YYYY-MM-DD')) {
            return true;
        }

        let result = false;

        if (dateTimeElement.availableDateTimes === AvailableDateTimes.DatesFromVariable && dateTimeElement.variableAvailableDateTimes) {
            const variableValue = dateTimeElement.variableAvailableDateTimes;
            const actualFormat = view === 'hours' ? 'YYYY-MM-DD HH' : 'YYYY-MM-DD HH:mm';

            const datesFromVariable = variableValue.map(d => dayjs(d, dateTimeElement.dateTimeFormat, false).format(actualFormat));
            const currentDate = dateTimeArgument.format(actualFormat);

            result = !datesFromVariable.includes(currentDate);
        }

        if (result === false && !isNil(dateTimeElement.disabledTimes) && view === 'minutes') {
            const format = 'HH:mm';
            result = dateTimeElement.disabledTimes.map(d => dayjs(getMinMaxValue(d), dateTimeElement.dateTimeFormat, false).format(format)).includes(dateTimeArgument.format(format));
        }

        if (result === false && !isNil(dateTimeElement.disabledDateAndTimes) && view === 'minutes') {
            const dateAndTimeFormat = 'YYYY-MM-DD HH:mm';

            result = dateTimeElement.disabledDateAndTimes.map(d => {
                return dayjs(d, dateTimeElement.dateTimeFormat, false).format(dateAndTimeFormat);
            }).includes(dateTimeArgument.format(dateAndTimeFormat));
        }

        if (result === false && dateTimeElement.parkTime && view === 'minutes') {
            let startDateTime = dateTimeArgument;
            const timeStep = dateTimeElement.minutesStep || 5;

            let durationInMinutes = getParkTimeInMinutes(dateTimeElement.parkTime, dateTimeElement.parkTimeType ?? TimeDurationUnit.MINUTES);

            while (durationInMinutes > timeStep) {
                const formatDateTime = 'YYYY-MM-DD HH:mm' as const;
                const formatTime = 'HH:mm' as const;
                const currentSlotTime = startDateTime.add(timeStep, 'minute');
                const formattedCurrentSlotDateTime = currentSlotTime.format(formatDateTime);
                const formattedCurrentSlotTime = currentSlotTime.format(formatTime);

                if (!isNil(dateTimeElement.disabledTimes)) {
                    const hasInDisabledTimes = dateTimeElement.disabledTimes.map(d => dayjs(getMinMaxValue(d), dateTimeElement.dateTimeFormat, false).format(formatTime)).includes(formattedCurrentSlotTime)

                    if (hasInDisabledTimes) {
                        result = true;
                        break;
                    }
                }

                if (!isNil(dateTimeElement.disabledDateAndTimes)) {
                    const hasInDisabledDateAndTimes = dateTimeElement.disabledDateAndTimes.map(d => {
                        return dayjs(d, dateTimeElement.dateTimeFormat, false).format(formatDateTime);
                    }).includes(formattedCurrentSlotDateTime);

                    if (hasInDisabledDateAndTimes) {
                        result = true;
                        break;
                    }
                }

                startDateTime = currentSlotTime;
                durationInMinutes -= timeStep;
            }


        }

        return result;
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

            if (dateTimeElement.parkTime && dateTimeElement.parkTimeType !== TimeDurationUnit.DAYS) {
                return maxValue.add(-dateTimeElement.parkTime, dateTimeElement.parkTimeType === TimeDurationUnit.HOURS ? 'hour' : 'minute');
            }

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
