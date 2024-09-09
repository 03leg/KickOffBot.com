import { StaticSourceDescription, WebCardDescriptionClassic, WebInputCardsUIElement } from '@kickoffbot.com/types';
import React, { useCallback } from 'react';
import { v4 } from 'uuid';
import { ItemsListEditor } from '~/components/commons/ItemsListEditor';
import { CardDetailsView } from './CardDetailsView/CardDetailsView';
import { getUniqueCardName } from './StaticCardsEditor.utils';
import { Box } from '@mui/material';
import { CardDemoView } from './CardDemoView';

interface Props {
    element: WebInputCardsUIElement;
}

export const StaticCardsEditor = ({ element }: Props) => {
    const staticSourceDescription = (element?.sourceDescription as StaticSourceDescription);
    const [items, setItems] = React.useState(staticSourceDescription?.cards);
    const [selectedCard, setSelectedCard] = React.useState<WebCardDescriptionClassic | undefined>(staticSourceDescription?.cards[0]);
    const [demoCardDescription, setDemoCardDescription] = React.useState<WebCardDescriptionClassic | undefined>(staticSourceDescription?.cards[0]);


    const handleNewCard = useCallback(() => {
        const newCard: WebCardDescriptionClassic = {
            id: v4(),
            imgUrl: '',
            title: getUniqueCardName(items.map(c => c.title ?? ''), 'New Card #'),
        }
        setItems([...items, newCard]);

        staticSourceDescription.cards = [...items, newCard];
        setSelectedCard(newCard);
        setDemoCardDescription({ ...newCard })
    }, [items, staticSourceDescription]);

    const handleSelectCard = useCallback((card: WebCardDescriptionClassic) => {
        setSelectedCard(card);
        setDemoCardDescription({ ...card })
    }, []);


    return (
        <Box sx={{ display: 'flex', width: '100%' }}>

            <ItemsListEditor
                items={items}
                entryName='Card'
                onDeleteItem={() => { }}
                onNewItem={handleNewCard}
                onSelect={handleSelectCard}
                selectedItem={selectedCard}
                detailsView={<CardDetailsView item={selectedCard} onChange={() => { setDemoCardDescription({ ...selectedCard! }) }} />}
            />

            {demoCardDescription &&
                <Box sx={{ height: '100%', width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 1, backgroundColor: "#F3F6F9" }}>
                    <CardDemoView card={demoCardDescription} />
                </Box>}
        </Box>
    )
}
