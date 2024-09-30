import { DynamicSourceDescription, StaticSourceDescription, WebCardDescriptionClassic, WebCardsSourceStrategy, WebInputCardsUIElement } from '@kickoffbot.com/types';
import { Box, Button } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { isEmpty } from 'lodash';
import { Card1 } from './Card1';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { v4 } from 'uuid';
import { getTextForContextObject } from './CardsDemoView.utils';

interface Props {
    element: WebInputCardsUIElement;

}

export const CardsDemoView = ({ element }: Props) => {
    const [selectedCards, setSelectedCards] = React.useState<WebCardDescriptionClassic[]>([]);
    const [showUserResponse, setShowUserResponse] = React.useState<boolean>(false);
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

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

    const dynamicCards = useMemo(() => {
        const result: WebCardDescriptionClassic[] = [];

        const description = element.sourceDescription as DynamicSourceDescription;
        const variable = description.cardsVariableId ? getVariableById(description.cardsVariableId) : null;
        if (!variable) {
            return result;
        }

        const items = JSON.parse(variable.value as string);

        if (!(items instanceof Array)) {
            return result;
        }

        for (const item of items) {
            const index = items.indexOf(item);
            const card: WebCardDescriptionClassic = {
                id: v4(),
                title: description.cardDescription?.value ? getTextForContextObject(item, description.cardDescription.value, index) : 'Unknown',
                image: description.cardDescription?.imgUrl ? getTextForContextObject(item, description.cardDescription.imgUrl, index) : 'Unknown',
                htmlDescription: description.cardDescription?.htmlDescription ? getTextForContextObject(item, description.cardDescription.htmlDescription, index) : 'Unknown',
            };

            result.push(card);
        }

        return result;

    }, [element.sourceDescription, getVariableById]);

    return (
        <>

            <>
                {!showUserResponse &&
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', padding: 1, overflowY: 'auto' }}>
                            {element.strategy === WebCardsSourceStrategy.Static && <>
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
                            </>}
                            {element.strategy === WebCardsSourceStrategy.Dynamic && <>
                                {dynamicCards.map((card, index) =>
                                    <Card1
                                        selectableCard={element.selectableCards}
                                        useCardButtons={element.useCardButtons}
                                        cardButtons={element.buttons}
                                        selected={selectedCards.includes(card)}
                                        onSelectedChange={(newValue) => {
                                            handleSelectedChange(newValue, card);
                                        }}
                                        isLast={index === dynamicCards.length - 1}
                                        key={card.id}
                                        card={card} />
                                )}
                            </>}
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


        </>
    )
}
