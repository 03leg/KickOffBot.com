import { WebInputCardsUIElement } from '@kickoffbot.com/types';
import { Box } from '@mui/material'
import React, {  } from 'react';
import { ManualStrategyButtonsEditor } from '../../../../../ButtonsInput/Editor/ManualStrategyButtonsEditor';

interface Props {
    element: WebInputCardsUIElement
}

export const CardButtonsEditor = ({ element }: Props) => {


    return (
        <Box data-testid="CardButtonsEditor">
            <ManualStrategyButtonsEditor element={element} />
        </Box>
    )
}
