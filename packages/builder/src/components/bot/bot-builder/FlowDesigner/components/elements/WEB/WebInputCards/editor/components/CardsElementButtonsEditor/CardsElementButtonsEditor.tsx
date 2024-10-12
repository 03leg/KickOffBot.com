import { ButtonElement, WebInputCardsUIElement } from '@kickoffbot.com/types';
import { Box } from '@mui/material'
import React, { useCallback } from 'react';
import { ManualStrategyButtonsEditor } from '../../../../../ButtonsInput/Editor/ManualStrategyButtonsEditor';

interface Props {
    element: WebInputCardsUIElement;
    property: "cardButtons" | "generalButtons";
}

export const CardsElementButtonsEditor = ({ element, property }: Props) => {
    const [buttons, setButtons] = React.useState(element[property] ?? []);

    const handleButtonsChange = useCallback((buttons: ButtonElement[]) => {
        element[property] = buttons;
        setButtons(buttons);
    }, [element, property]);

    return (
        <Box data-testid="CardsElementButtonsEditor">
            <ManualStrategyButtonsEditor buttons={buttons} onButtonsChange={handleButtonsChange} />
        </Box>
    )
}
