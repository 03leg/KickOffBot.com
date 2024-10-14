import { StaticSourceDescription, WebCardDescriptionClassic, WebInputCardsUIElement } from '@kickoffbot.com/types';
import React, { useCallback } from 'react';
import { v4 } from 'uuid';
import { ItemsListEditor } from '~/components/commons/ItemsListEditor';
import { CardDetailsView } from './CardDetailsView/CardDetailsView';
import { getUniqueCardName } from './StaticCardsEditor.utils';
import { Box } from '@mui/material';

interface Props {
    element: WebInputCardsUIElement;
}

export const StaticCardsEditor = ({ element }: Props) => {
    const staticSourceDescription = (element?.sourceDescription as StaticSourceDescription);
    const [items, setItems] = React.useState(staticSourceDescription?.cards);
    const [selectedCard, setSelectedCard] = React.useState<WebCardDescriptionClassic | undefined>(staticSourceDescription?.cards[0]);
    // const [demoCardDescription, setDemoCardDescription] = React.useState<WebCardDescriptionClassic | undefined>(staticSourceDescription?.cards[0]);


    const handleNewCard = useCallback(() => {
        const newCard: WebCardDescriptionClassic = {
            id: v4(),
            image: '',
            title: getUniqueCardName(items.map(c => c.title ?? ''), 'New Card #'),
        }
        setItems([...items, newCard]);

        staticSourceDescription.cards = [...items, newCard];
        setSelectedCard(newCard);

    }, [items, staticSourceDescription]);

    const handleDeleteCard = useCallback((card: WebCardDescriptionClassic) => {
        const newCards = items.filter(c => c.id !== card.id);

        setItems(newCards);
        staticSourceDescription.cards = newCards;
        if (newCards.length >= 1) {
            setSelectedCard(newCards[0]);
        }
        else {
            setSelectedCard(undefined);
        }

    }, [items, staticSourceDescription]);

    const handleSelectCard = useCallback((card: WebCardDescriptionClassic) => {
        setSelectedCard(card);
    }, []);


    return (
        <Box sx={{ display: 'flex', width: '100%' }}>

            <ItemsListEditor
                items={items}
                entryName='Card'
                onDeleteItem={handleDeleteCard}
                onNewItem={handleNewCard}
                onSelect={handleSelectCard}
                selectedItem={selectedCard}
                detailsView={<CardDetailsView item={selectedCard} onChange={() => { }} />}
            />
            
        </Box>
    )
}
