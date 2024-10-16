import React, { useCallback, useState } from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import { useTextBoxRequestStyles } from './TextBotRequest.style';
import SendIcon from '@mui/icons-material/Send';
import { RequestDescriptionWebRuntime, TextRequestElement } from '@kickoffbot.com/types';
import { throwIfNil } from '~/utils/guard';

interface Props {
    request: RequestDescriptionWebRuntime;
}

export const TextBotRequest = ({ request }: Props) => {
    const { placeholder } = request.element as TextRequestElement;
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
                autoFocus /* multiline maxRows={4} */
                onKeyDown={handleTextFieldKeyDown}
                className={classes.textField} fullWidth variant="outlined" value={currentValue} onChange={handleValueChange} placeholder={placeholder} />
            <IconButton onClick={handleSendResponse}>
                <SendIcon />
            </IconButton>
        </Box>
    )
}
