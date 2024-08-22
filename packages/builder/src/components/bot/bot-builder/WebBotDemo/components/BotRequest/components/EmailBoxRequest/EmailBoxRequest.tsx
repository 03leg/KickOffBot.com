import React, { useCallback, useState } from 'react'
import { RequestDescription } from '../../../../types';
import { WebInputEmailUIElement } from '@kickoffbot.com/types';
import { Box, TextField, IconButton } from '@mui/material';
import { useEmailBoxRequestStyles } from './EmailBoxRequest.style';
import SendIcon from '@mui/icons-material/Send';


interface Props {
    request: RequestDescription;
}

export const EmailBoxRequest = ({ request }: Props) => {
    const { placeholder } = request.element as WebInputEmailUIElement;
    const { classes } = useEmailBoxRequestStyles();
    const [currentValue, setCurrentValue] = useState<string>('');
    const [emailError, setEmailError] = useState(false);
    const [showEmailError, setShowEmailError] = useState(false);

    const handleSendResponse = useCallback(() => {
        if (emailError) {
            setShowEmailError(true);
            return;
        }

        request.onResponse({ data: currentValue })
    }, [currentValue, emailError, request]);

    const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setShowEmailError(false);

        if (event.target.validity.valid) {
            setEmailError(false);
        } else {
            setEmailError(true);
        }

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
                autoFocus
                onKeyDown={handleTextFieldKeyDown}
                inputProps={{
                    type: "email",
                }}
                helperText={showEmailError && emailError ? 'Email is not valid' : undefined}
                error={showEmailError && emailError}
                className={classes.textField} fullWidth variant="outlined" value={currentValue} onChange={handleValueChange} placeholder={placeholder} />
            <IconButton onClick={handleSendResponse}>
                <SendIcon />
            </IconButton>
        </Box>
    )
}
