import React, { useCallback, useState } from 'react'
import { RequestDescription } from '../../../../types';
import { usePhoneBoxRequestStyles } from './PhoneBoxRequest.style';
import { Box, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { PhoneEditor } from './PhoneEditor';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { WebInputPhoneUIElement } from '@kickoffbot.com/types';

interface Props {
    request: RequestDescription;
}

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone: string) => {
    try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
        return false;
    }
};

export const PhoneBoxRequest = ({ request }: Props) => {
    const { classes } = usePhoneBoxRequestStyles();
    const element = request.element as WebInputPhoneUIElement; 
    const [phoneValue, setPhoneValue] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);

    const handleSendResponse = useCallback(() => {
        if (!isPhoneValid(phoneValue ?? '')) {
            setError(true);
            return;
        }

        request.onResponse({ data: phoneValue })
    }, [phoneValue, request]);


    const handlePhoneChange = useCallback((newValue: string | null) => {
        setError(false);

        setPhoneValue(newValue);
    }, [])

    return (
        <Box className={classes.root}>
            <Box className={classes.textField}>
                <PhoneEditor value={phoneValue ?? ''} defaultCountry={element.defaultCountry} onChange={handlePhoneChange} error={error} helperText={error ? 'Phone number is not valid' : ''} />
            </Box>
            <IconButton onClick={handleSendResponse} >
                <SendIcon />
            </IconButton>
        </Box>
    )
}
