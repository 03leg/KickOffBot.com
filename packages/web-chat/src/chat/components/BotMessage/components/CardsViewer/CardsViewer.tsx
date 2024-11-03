import { CardsViewerElement } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React from 'react';
import { Card1 } from '../../../BotRequest/components/CardsBoxRequest/components/Card1';


interface Props {
    cardsDescription: CardsViewerElement;
    onContentHeightChange: () => void;
}

export const CardsViewer = ({ cardsDescription, onContentHeightChange }: Props) => {
    return (
        <Box sx={{ width: 'calc(100% - 50px)', display: 'flex', flexDirection: 'column', padding: 1, boxSizing: 'border-box' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', padding: 1, overflowY: 'auto' }}>
                {
                    cardsDescription.cardItems.map((card, index) => {
                        return <Card1
                            selectableCard={false}
                            useCardButtons={false}
                            selected={false}
                            onContentHeightChange={onContentHeightChange}
                            onSelectedChange={() => {
                            }}
                            onButtonClick={() => {
                            }}
                            isLast={index === cardsDescription.cardItems.length - 1}
                            key={card.id}
                            card={card} />
                    })
                }
                {cardsDescription.cardItems.length === 0 && <Box sx={{ display: 'flex', justifyContent: 'center' }}>There is no cards....</Box>}
            </Box>
        </Box>
    )
}
