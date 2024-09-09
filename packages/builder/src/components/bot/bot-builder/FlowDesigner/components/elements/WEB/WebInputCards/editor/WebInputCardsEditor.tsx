import { WebCardsSourceStrategy, WebInputCardsUIElement } from '@kickoffbot.com/types';
import { Box, Checkbox, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React, { useCallback } from 'react';
import { DynamicCardsEditor } from './components/DynamicCardsEditor';
import { StaticCardsEditor } from './components/StaticCardsEditor';

interface Props {
    element: WebInputCardsUIElement;
}


export const WebInputCardsEditor = ({ element }: Props) => {
    const [multipleChoiceValue, setMultipleChoiceValue] = React.useState<boolean>(element.multipleChoice ?? false);
    const [cardsSourceStrategy, setCardsSourceStrategy] = React.useState<WebCardsSourceStrategy>(element.strategy);

    const handleMultipleChoiceValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setMultipleChoiceValue(event.target.checked);
        element.multipleChoice = event.target.checked;
    }, [element]);

    const handleSourceStrategyChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value) as WebCardsSourceStrategy;
        setCardsSourceStrategy(newValue);

        element.strategy = newValue;
        element.sourceDescription = newValue === WebCardsSourceStrategy.Static ? {
            cards: []
        } : {};
    }, [element]);

    return (
        <Box>
            <FormControlLabel control={<Checkbox checked={multipleChoiceValue} onChange={handleMultipleChoiceValueChange} />} label="Multiple choice" />

            <RadioGroup sx={{ flex: 1 }} value={cardsSourceStrategy} onChange={handleSourceStrategyChange}>
                <FormControlLabel value={WebCardsSourceStrategy.Static} control={<Radio />} label="Static cards" />
                <FormControlLabel value={WebCardsSourceStrategy.Dynamic} control={<Radio />} label="Dynamic cards" />
            </RadioGroup>

            {cardsSourceStrategy === WebCardsSourceStrategy.Dynamic && <DynamicCardsEditor element={element} />}
            {cardsSourceStrategy === WebCardsSourceStrategy.Static && <StaticCardsEditor element={element} />}
        </Box>
    )
}
