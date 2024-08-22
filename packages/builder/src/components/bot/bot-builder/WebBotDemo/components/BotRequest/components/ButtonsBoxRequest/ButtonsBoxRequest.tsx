import React, { useCallback, useMemo } from 'react';
import { RequestDescription } from '../../../../types';
import { WebInputButtonsUIElement } from '@kickoffbot.com/types';
import { Box, Button } from '@mui/material';
import { useButtonsBoxRequestStyles } from './ButtonsBoxRequest.style';
import { WebButtonDescription, WebButtonsManager } from '../../../../runtime/WebButtonsManager';

interface Props {
    request: RequestDescription;
}

export const ButtonsBoxRequest = ({ request }: Props) => {
    const element = request.element as WebInputButtonsUIElement;
    const { classes } = useButtonsBoxRequestStyles();
    const buttons = useMemo(() => {
        const result = WebButtonsManager.getButtonsForMessage(request.userContext, element.id, element, request.utils);
        if (!result) {
            return [];
        }

        return result;

    }, [element, request.userContext, request.utils]);

    const handleButtonClick = useCallback((button: WebButtonDescription) => {
        request.onResponse({ data: button })
    }, [request])

    return (
        <Box className={classes.root}>
            {buttons?.map(b => <Button className={classes.button} variant="outlined" onClick={() => handleButtonClick(b)} key={b.callback_data}>{b.text}</Button>)}
        </Box>
    )
}
