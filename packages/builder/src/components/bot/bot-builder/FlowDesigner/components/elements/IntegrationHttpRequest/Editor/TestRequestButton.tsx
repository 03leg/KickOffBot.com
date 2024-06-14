import { HTTPRequestIntegrationUIElement } from '@kickoffbot.com/types';
import { Box, Button } from '@mui/material';
import React, { useCallback } from 'react'

interface Props {
    element: HTTPRequestIntegrationUIElement;
}

export const TestRequestButton = ({ element }: Props) => {


    const handleSendTestRequest = useCallback(() => {
        try {
            // const instance = new SendReceiveHttpRequest(element);
            // await instance.checkRequest();
        }
        catch {
            alert('Failed to send test request!')
        }
    }, [])

    return (
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
            <Button variant="contained" color="success" size='small' onClick={handleSendTestRequest}>Send test request</Button>
        </Box>
    )
}
