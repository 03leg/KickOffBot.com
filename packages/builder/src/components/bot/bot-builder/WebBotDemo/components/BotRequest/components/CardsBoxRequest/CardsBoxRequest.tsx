import { ButtonElement, CardsRequestElement, CardsUserResponse, RequestDescriptionWebRuntime, WebCardChatItem } from '@kickoffbot.com/types';
import { Box, Button } from '@mui/material';
import { isEmpty } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { Card1 } from '~/components/bot/bot-builder/FlowDesigner/components/elements/WEB/WebInputCards/editor/components/StaticCardsEditor/CardDemoView/Card1';
import { throwIfNil } from '~/utils/guard';

interface Props {
    request: RequestDescriptionWebRuntime;
}

export const CardsBoxRequest = ({ request }: Props) => {
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

        if (data.length === 0 && cardsElementRequestDescription.useCardButtons && cardsElementRequestDescription.showSendButton) {
            response.actionName = sendButtonText;
        }

        request.onResponse({
            data: response
        });
    }, [cardsElementRequestDescription.showSendButton, cardsElementRequestDescription.useCardButtons, request, selectedCards, sendButtonText]);

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
            clickedButton: button
        };

        request.onResponse({
            data: response
        });
    }, [request]);

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', padding: 1, boxSizing: 'border-box' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', padding: 1, overflowY: 'auto' }}>
                {
                    cardsElementRequestDescription.cardItems.map((card, index) => {
                        return <Card1
                            selectableCard={cardsElementRequestDescription.selectableCards}
                            useCardButtons={cardsElementRequestDescription.useCardButtons}
                            cardButtons={cardsElementRequestDescription.useCardButtons ? cardsElementRequestDescription.cardButtons : undefined}
                            selected={selectedCards.includes(card)}
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
            </Box>
            {
                (
                    (cardsElementRequestDescription.selectableCards && (cardsElementRequestDescription.multipleChoice || (!cardsElementRequestDescription.multipleChoice && !cardsElementRequestDescription.sendResponseOnSelect))) ||
                    (!cardsElementRequestDescription.selectableCards && cardsElementRequestDescription.showSendButton)
                ) &&
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                    <Button disabled={selectedCards.length === 0 && cardsElementRequestDescription.useCardButtons !== true && cardsElementRequestDescription.showSendButton !== true} sx={{ textTransform: 'none' }} variant='contained' onClick={() => sendResponse()}>
                        {sendButtonText}
                    </Button>
                </Box>
            }
        </Box>
    )
}
