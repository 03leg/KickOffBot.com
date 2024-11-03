import { Box, TextField } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { useNumberBoxRequestStyles } from './NumberBoxRequest.style';
import { NumberRequestElement, RequestDescriptionWebRuntime } from '@kickoffbot.com/types';
import { SendResponseButton } from '../SendResponseButton';
import { throwIfNil } from '../../../../utils/guard';

interface Props {
    request: RequestDescriptionWebRuntime;
}


export const NumberBoxRequest = ({ request }: Props) => {
    const numberElement = request.element as NumberRequestElement;
    const { classes } = useNumberBoxRequestStyles();
    const [currentValue, setCurrentValue] = useState<number>();

    const handleSendResponse = useCallback(() => {
        throwIfNil(request.onResponse);

        request.onResponse({ data: currentValue })
    }, [currentValue, request]);

    const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '') {
            setCurrentValue(undefined);
            return;
        }
        const value = Number(event.target.value);

        if (numberElement.max && value > numberElement.max) return;
        if (numberElement.min && value < numberElement.min) return;

        setCurrentValue(value);
    }, [numberElement.max, numberElement.min]);

    const handleNumberFieldKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSendResponse();
        }
    }, [handleSendResponse]);

    const buttonSendDisabled = useMemo(() => {
        return typeof currentValue !== 'number';
    }, [currentValue]);

    return (
        <Box className={classes.root}>
            <TextField
                autoFocus
                onKeyDown={handleNumberFieldKeyDown}
                type="number"
                InputProps={{ inputProps: { min: numberElement.min, max: numberElement.max, step: numberElement.step } }}
                className={classes.textField} fullWidth
                variant="outlined" value={currentValue ?? ''}
                onChange={handleValueChange} placeholder={numberElement.placeholder} />

            <SendResponseButton onSendResponse={handleSendResponse} disabled={buttonSendDisabled}/>
        </Box>
    )
}
