import { WebInputButtonsUIElement } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React from 'react';
import { ButtonsEditor } from '../../../ButtonsInput/Editor';

interface Props {
    element: WebInputButtonsUIElement;
}


export const WebButtonsInputEditor = ({ element }: Props) => {
    return (
        <Box>
            <ButtonsEditor element={element} />
        </Box>
    )
}
