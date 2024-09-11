import { StaticSourceDescription, WebCardDescriptionClassic, WebCardsSourceStrategy, WebInputCardsUIElement } from '@kickoffbot.com/types';
import { Box, Button } from '@mui/material';
import React, { useCallback } from 'react';
import { isEmpty } from 'lodash';
import { Card1 } from './Card1';

interface Props {
    element: WebInputCardsUIElement;

}

export const CardsDemoView = ({ element }: Props) => {
    const [selectedCards, setSelectedCards] = React.useState<WebCardDescriptionClassic[]>([]);
    const [showUserResponse, setShowUserResponse] = React.useState<boolean>(false);

    const handleSelectedChange = useCallback((newValue: boolean, card: WebCardDescriptionClassic) => {
        if (element.selectableCards) {
            if (newValue) {
                if (element.multipleChoice) {
                    setSelectedCards([...selectedCards, card]);
                }
                else {
                    setSelectedCards([card]);

                    if (element.sendResponseOnSelect) {
                        setShowUserResponse(true);
                    }
                }
            } else {
                setSelectedCards(selectedCards.filter(c => c.id !== card.id));
            }
        }
    }, [element.multipleChoice, element.selectableCards, element.sendResponseOnSelect, selectedCards]);

    return (
        <>
            {element.strategy === WebCardsSourceStrategy.Static &&
                <>
                    {!showUserResponse &&
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', padding: 1, overflowY: 'auto' }}>
                                {(element.sourceDescription as StaticSourceDescription).cards.map((card, index) =>
                                    <Card1
                                        selectableCard={element.selectableCards}
                                        useCardButtons={element.useCardButtons}
                                        cardButtons={element.buttons}
                                        selected={selectedCards.includes(card)}
                                        onSelectedChange={(newValue) => {
                                            handleSelectedChange(newValue, card);
                                        }}
                                        isLast={index === (element.sourceDescription as StaticSourceDescription).cards.length - 1}
                                        key={card.id}
                                        card={card} />
                                )}
                            </Box>

                            {
                                (
                                    (element.selectableCards && (element.multipleChoice || (!element.multipleChoice && !element.sendResponseOnSelect))) ||
                                    (!element.selectableCards && element.showSendButton)
                                ) &&
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                                    <Button disabled={selectedCards.length === 0} sx={{ textTransform: 'none' }} variant='contained' onClick={() => setShowUserResponse(true)}>
                                        {element.sendButtonText && !isEmpty(element.sendButtonText) ? element.sendButtonText : 'Send'}
                                    </Button>
                                </Box>
                            }
                        </Box>
                    }
                    {showUserResponse &&
                        <Box sx={{

                            width: '100%',
                            display: 'flex',
                            justifyContent: 'flex-end'

                        }}>
                            <Box sx={{
                                padding: ({ spacing }) => spacing(1, 2),
                                borderRadius: ({ shape }) => shape.borderRadius,
                                backgroundColor: "#ebebeb",
                            }}>
                                {selectedCards.map(card => card.title).join(', ')}
                            </Box>
                        </Box>
                    }
                </>
            }
            {element.strategy === WebCardsSourceStrategy.Dynamic && <div>Dynamic</div>}
        </>
    )
}
