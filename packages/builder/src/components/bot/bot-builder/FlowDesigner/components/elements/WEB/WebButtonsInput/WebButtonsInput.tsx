import { ElementType, WebInputButtonsUIElement } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React from 'react';
import { ButtonsInput } from '../../ButtonsInput/ButtonsInput';

interface Props {
    element: WebInputButtonsUIElement;
}

export const WebButtonsInput = ({ element }: Props) => {
    return (
        <Box>
            <ButtonsInput element={{ ...element, type: ElementType.WEB_INPUT_BUTTONS }} />
        </Box>
    )
}
