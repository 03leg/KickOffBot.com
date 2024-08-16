import React, { useCallback, useState } from 'react';
import { RequestDescription } from '../../../../types';
import { Box, IconButton, TextField } from '@mui/material';
import { useTextBoxRequestStyles } from './TextBotRequest.style';
import SendIcon from '@mui/icons-material/Send';

interface Props {
    request: RequestDescription;
}

export const TextBotRequest = ({ request }: Props) => {
    const { classes } = useTextBoxRequestStyles();
    const [currentValue, setCurrentValue] = useState<string>('');

    const handleSendResponse = useCallback(() => {
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
                className={classes.textField} fullWidth variant="outlined" value={currentValue} onChange={handleValueChange} placeholder={request.element.placeholder} />
            <IconButton onClick={handleSendResponse}>
                <SendIcon />
            </IconButton>
        </Box>
    )
}
