import { WebCardsSourceStrategy, WebInputCardsUIElement } from '@kickoffbot.com/types';
import { Box, Button, Checkbox, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React, { useCallback } from 'react';
import { DynamicCardsEditor } from './components/DynamicCardsEditor';
import { StaticCardsEditor } from './components/StaticCardsEditor';
import PreviewIcon from '@mui/icons-material/Preview';
import { useAppDialog } from '~/components/bot/bot-builder/Dialog/useAppDialog';
import { CardsDemoView } from './components/StaticCardsEditor/CardDemoView/CardsDemoView';

interface Props {
    element: WebInputCardsUIElement;
}


export const WebInputCardsEditor = ({ element }: Props) => {
    const [multipleChoiceValue, setMultipleChoiceValue] = React.useState<boolean>(element.multipleChoice ?? false);
    const [cardsSourceStrategy, setCardsSourceStrategy] = React.useState<WebCardsSourceStrategy>(element.strategy);
    const { openDialog } = useAppDialog();

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

    const handleShowPreview = useCallback(() => {
        openDialog({
            title: 'Preview',
            content: <CardsDemoView element={element} />

        })

    }, [element, openDialog]);

    return (
        <Box>
            <FormControlLabel control={<Checkbox checked={multipleChoiceValue} onChange={handleMultipleChoiceValueChange} />} label="Multiple choice" />

            <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                <Box sx={{ marginBottom: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <RadioGroup sx={{ flex: 1 }} row value={cardsSourceStrategy} onChange={handleSourceStrategyChange}>
                        <FormControlLabel value={WebCardsSourceStrategy.Static} control={<Radio />} label="Static cards" />
                        <FormControlLabel value={WebCardsSourceStrategy.Dynamic} control={<Radio />} label="Dynamic cards" />
                    </RadioGroup>
                    <Button variant="contained" startIcon={<PreviewIcon />} onClick={handleShowPreview}>Preview</Button>
                </Box>


                {cardsSourceStrategy === WebCardsSourceStrategy.Dynamic && <DynamicCardsEditor element={element} />}
                {cardsSourceStrategy === WebCardsSourceStrategy.Static &&

                    <StaticCardsEditor element={element} />

                }
            </Box>
        </Box>
    )
}
