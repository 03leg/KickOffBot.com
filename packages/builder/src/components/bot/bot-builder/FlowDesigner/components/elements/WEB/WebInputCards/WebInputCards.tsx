import { DynamicSourceDescription, StaticSourceDescription, WebCardsSourceStrategy, WebInputCardsUIElement } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React from 'react';
import { CardsConfigurationDescription } from './components/CardsConfigurationDescription';

interface Props {
    element: WebInputCardsUIElement;
}

export const WebInputCards = ({ element }: Props) => {
    const dynamicDescription = (element.sourceDescription as DynamicSourceDescription);
    return (
        <Box>
            {element.strategy === WebCardsSourceStrategy.Static && <>
                {(element.sourceDescription as StaticSourceDescription).cards.length === 0 && <div>Configure &quot;Web Cards&quot;...</div>}
                {(element.sourceDescription as StaticSourceDescription).cards.length > 0 && <CardsConfigurationDescription element={element} />}
            </>}
            {element.strategy === WebCardsSourceStrategy.Dynamic &&
                <>
                    {(!dynamicDescription.cardsVariableId || dynamicDescription.cardDescription?.value === undefined) && <div>Configure &quot;Web Cards&quot;...</div>}
                    {dynamicDescription.cardsVariableId && dynamicDescription.cardDescription?.value !== undefined && <CardsConfigurationDescription element={element} />}
                </>}
        </Box>
    )
}
