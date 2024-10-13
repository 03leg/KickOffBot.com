import { ButtonElement, CardsRequestElement, CardsUserResponse, RequestDescriptionWebRuntime, WebCardChatItem } from '@kickoffbot.com/types';
import { Box, Button } from '@mui/material';
import { isEmpty } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { Card1 } from '~/components/bot/bot-builder/FlowDesigner/components/elements/WEB/WebInputCards/editor/components/StaticCardsEditor/CardDemoView/Card1';
import { throwIfNil } from '~/utils/guard';

interface Props {
    request: RequestDescriptionWebRuntime;
    onContentHeightChange: () => void;
}

export const CardsBoxRequest = ({ request, onContentHeightChange }: Props) => {
    const cardsElementRequestDescription = request.element as CardsRequestElement;
    const [selectedCards, setSelectedCards] = React.useState<WebCardChatItem[]>([]);

    const sendButtonText = useMemo(() => {
        return cardsElementRequestDescription.sendButtonText && !isEmpty(cardsElementRequestDescription.sendButtonText) ? cardsElementRequestDescription.sendButtonText : 'Send';
    }, [cardsElementRequestDescription.sendButtonText]);

    const sendResponse = useCallback((cards: WebCardChatItem[] = selectedCards) => {
        throwIfNil(request.onResponse);

        const data = cards.map(c => ({ id: c.id, value: c.value }));

        const response: CardsUserResponse = {
            selectedCards: data
        };

        request.onResponse({
            data: response
        });
    }, [request, selectedCards]);

    const handleSelectedChange = useCallback((newValue: boolean, card: WebCardChatItem) => {
        if (cardsElementRequestDescription.selectableCards) {
            if (newValue) {
                if (cardsElementRequestDescription.multipleChoice) {
                    setSelectedCards([...selectedCards, card]);
                }
                else {
                    setSelectedCards([card]);

                    if (cardsElementRequestDescription.sendResponseOnSelect) {
                        sendResponse([card]);
                    }
                }
            } else {
                setSelectedCards(selectedCards.filter(c => c.id !== card.id));
            }
        }
    }, [cardsElementRequestDescription.multipleChoice, cardsElementRequestDescription.selectableCards, cardsElementRequestDescription.sendResponseOnSelect, selectedCards, sendResponse]);

    const handleButtonClick = useCallback((button: ButtonElement, card: WebCardChatItem) => {
        throwIfNil(request.onResponse);

        const response: CardsUserResponse = {
            selectedCards: [card].map(c => ({ id: c.id, value: c.value })),
            clickedCardButton: button
        };

        request.onResponse({
            data: response
        });
    }, [request]);

    const handleGeneralButtonClick = useCallback((button: ButtonElement) => {
        throwIfNil(request.onResponse);

        const response: CardsUserResponse = {
            selectedCards: [],
            clickedGeneralButton: button,
            actionName: button.content
        };

        request.onResponse({
            data: response
        });
        
    },[request]);

    return (
        <Box data-testid="cards-box-request" sx={{ width: '100%', display: 'flex', flexDirection: 'column', padding: 1, boxSizing: 'border-box' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', padding: 1, overflowY: 'auto' }}>
                    {
                        cardsElementRequestDescription.cardItems.map((card, index) => {
                            return <Card1
                                selectableCard={cardsElementRequestDescription.selectableCards}
                                useCardButtons={cardsElementRequestDescription.useCardButtons}
                                cardButtons={cardsElementRequestDescription.useCardButtons ? cardsElementRequestDescription.cardButtons : undefined}
                                selected={selectedCards.includes(card)}
                                onContentHeightChange={onContentHeightChange}
                                onSelectedChange={(newValue) => {
                                    handleSelectedChange(newValue, card);
                                }}
                                onButtonClick={(button) => {
                                    handleButtonClick(button, card);
                                }}
                                isLast={index === cardsElementRequestDescription.cardItems.length - 1}
                                key={card.id}
                                card={card} />
                        })
                    }
                    {cardsElementRequestDescription.cardItems.length === 0 && <Box sx={{ display: 'flex', justifyContent: 'center' }}>There is no cards....</Box>}
                </Box>
            </Box>
            {
                (
                    (cardsElementRequestDescription.selectableCards && (cardsElementRequestDescription.multipleChoice || (!cardsElementRequestDescription.multipleChoice && !cardsElementRequestDescription.sendResponseOnSelect)))
                ) &&
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                    <Button disabled={selectedCards.length === 0 && cardsElementRequestDescription.selectableCards} sx={{ textTransform: 'none' }} variant='outlined' onClick={() => sendResponse()}>
                        {sendButtonText}
                    </Button>
                </Box>
            }
            {
                (
                    (cardsElementRequestDescription.useGeneralButtons && (cardsElementRequestDescription.generalButtons ?? []).length > 0)
                ) &&
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 1, 
                    flexWrap: "wrap", }}>
                    {cardsElementRequestDescription.generalButtons?.map((button) => {
                        return <Button key={button.id} sx={{ textTransform: 'none', margin: ({ spacing }) => spacing(0, 0, 1, 1) }} variant='outlined' onClick={() => handleGeneralButtonClick(button)}>
                            {button.content}
                        </Button>;
                    })}
                </Box>
            }
        </Box>
    )
}
