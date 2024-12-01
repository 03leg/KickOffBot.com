import React, { useCallback, useState } from 'react';
import { Box, TextField } from '@mui/material';
import { useTextBoxRequestStyles } from './TextBotRequest.style';
import { RequestDescriptionWebRuntime, TextRequestElement } from '@kickoffbot.com/types';
import { SendResponseButton } from '../SendResponseButton';
import { throwIfNil } from '../../../../utils/guard';

interface Props {
    request: RequestDescriptionWebRuntime;
}

export const TextBotRequest = ({ request }: Props) => {
    const { placeholder, multiline } = request.element as TextRequestElement;
    const { classes } = useTextBoxRequestStyles();
    const [currentValue, setCurrentValue] = useState<string>('');

    const handleSendResponse = useCallback(() => {
        throwIfNil(request.onResponse);
        request.onResponse({ data: currentValue })
    }, [currentValue, request]);

    const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentValue(event.target.value);
    }, []);

    const handleTextFieldKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSendResponse();
        }
    }, [handleSendResponse]);

    return (
        <Box className={classes.root}>
            <TextField
                color='primary'
                autoFocus
                {...(multiline ? { multiline, rows: 3 } : {})}
                onKeyDown={handleTextFieldKeyDown}
                className={classes.textField} fullWidth variant="outlined" value={currentValue} onChange={handleValueChange} placeholder={placeholder} />
            <SendResponseButton onSendResponse={handleSendResponse} />
        </Box>
    )
}
