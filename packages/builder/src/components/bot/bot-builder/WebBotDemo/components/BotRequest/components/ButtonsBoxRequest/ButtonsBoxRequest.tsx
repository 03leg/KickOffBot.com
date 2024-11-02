import React, { useCallback, useMemo } from 'react';
import { ButtonsRequestElement, RequestButtonDescription, RequestDescriptionWebRuntime } from '@kickoffbot.com/types';
import { Box, Button } from '@mui/material';
import { useButtonsBoxRequestStyles } from './ButtonsBoxRequest.style';
import { throwIfNil } from '../../../../utils/guard';

interface Props {
    request: RequestDescriptionWebRuntime;
}

export const ButtonsBoxRequest = ({ request }: Props) => {
    const element = request.element as ButtonsRequestElement;
    const { classes } = useButtonsBoxRequestStyles();
    const buttons = useMemo(() => {
        const result = element.buttons;
        if (!result) {
            return [];
        }

        return result;

    }, [element]);

    const handleButtonClick = useCallback((button: RequestButtonDescription) => {
        throwIfNil(request.onResponse);

        request.onResponse({ data: button })
    }, [request])

    return (
        <Box className={classes.root}>
            {buttons?.map(b => <Button className={classes.button} variant="outlined" onClick={() => handleButtonClick(b)} key={b.id}>{b.content}</Button>)}
        </Box>
    )
}
