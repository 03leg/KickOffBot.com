import { Box, TextField, IconButton } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { useNumberBoxRequestStyles } from './NumberBoxRequest.style';
import { RequestDescription } from '../../../../types';
import { WebInputNumberUIElement } from '@kickoffbot.com/types';

interface Props {
    request: RequestDescription;
}


export const NumberBoxRequest = ({ request }: Props) => {
    const numberElement = request.element as WebInputNumberUIElement;
    const { classes } = useNumberBoxRequestStyles();
    const [currentValue, setCurrentValue] = useState<number>();

    const handleSendResponse = useCallback(() => {
        request.onResponse({ data: currentValue })
    }, [currentValue, request]);

    const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '') {
            setCurrentValue(undefined);
            return;
        }
        const value = Number(event.target.value);

        if (numberElement.max && value >= numberElement.max) return;
        if (numberElement.min && value <= numberElement.min) return;

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
            <IconButton onClick={handleSendResponse} disabled={buttonSendDisabled}>
                <SendIcon />
            </IconButton>
        </Box>
    )
}
