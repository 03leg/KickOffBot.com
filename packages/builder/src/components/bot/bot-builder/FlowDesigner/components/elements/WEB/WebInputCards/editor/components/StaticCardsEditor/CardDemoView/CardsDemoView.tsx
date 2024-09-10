import { StaticSourceDescription, WebCardsSourceStrategy, WebInputCardsUIElement } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React from 'react';
import { CardDemoView } from './CardDemoView';

interface Props {
    element: WebInputCardsUIElement;
}

export const CardsDemoView = ({ element }: Props) => {
    return (
        <>
            {element.strategy === WebCardsSourceStrategy.Static &&
                <Box sx={{ display: 'flex', flexDirection: 'row', padding: 1, backgroundColor: '#F3F6F9', overflowY: 'auto' }}>
                    {(element.sourceDescription as StaticSourceDescription).cards.map((card, index) =>
                        <CardDemoView isLast={index === (element.sourceDescription as StaticSourceDescription).cards.length - 1} key={card.id} card={card} />
                    )}
                </Box>
            }
            {element.strategy === WebCardsSourceStrategy.Dynamic && <div>Dynamic</div>}
        </>
    )
}
