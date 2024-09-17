import { BotVariable, WebCardsSourceStrategy, WebInputCardsUIElement } from '@kickoffbot.com/types';
import { Box, Button, Checkbox, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { DynamicCardsEditor } from './components/DynamicCardsEditor';
import { StaticCardsEditor } from './components/StaticCardsEditor';
import PreviewIcon from '@mui/icons-material/Preview';
import { useAppDialog } from '~/components/bot/bot-builder/Dialog/useAppDialog';
import { CardsDemoView } from './components/StaticCardsEditor/CardDemoView/CardsDemoView';
import { AppTextField } from '~/components/commons/AppTextField';
import { CardButtonsEditor } from './components/CardButtonsEditor';
import { VariableSelector } from '../../../../VariableSelector';
import { v4 } from 'uuid';

interface Props {
    element: WebInputCardsUIElement;
}


export const WebInputCardsEditor = ({ element }: Props) => {
    const [multipleChoiceValue, setMultipleChoiceValue] = React.useState<boolean>(element.multipleChoice ?? false);
    const [sendResponseOnSelect, setSendResponseOnSelect] = React.useState<boolean>(element.sendResponseOnSelect ?? false);
    const [selectableCardsValue, setSelectableCardsValue] = React.useState<boolean>(element.selectableCards ?? false);
    const [cardsSourceStrategy, setCardsSourceStrategy] = React.useState<WebCardsSourceStrategy>(element.strategy);
    const [sendButtonText, setSendButtonText] = React.useState<string>(element.sendButtonText ?? '');
    const [selectedVariableId, setSelectedVariableId] = useState<string>(element.variableId ?? '');
    const [showSendButton, setShowSendButton] = useState<boolean>(element.showSendButton ?? false);
    const { openDialog } = useAppDialog();

    const handleMultipleChoiceValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value === 'true';

        setMultipleChoiceValue(newValue);
        element.multipleChoice = newValue;

        if (newValue === false) {
            setSendResponseOnSelect(true);
            element.sendResponseOnSelect = true;
        }
    }, [element]);

    const handleSendResponseOnSelectValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked;

        setSendResponseOnSelect(newValue);
        element.sendResponseOnSelect = newValue;
    }, [element]);

    const handleSelectableCardsValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectableCardsValue(event.target.checked);
        element.selectableCards = event.target.checked;

        if (event.target.checked) {
            setMultipleChoiceValue(false);
            setSendResponseOnSelect(true);

            element.multipleChoice = false;
            element.sendResponseOnSelect = true;
        }

        if (!event.target.checked) {
            element.buttons = [];
        }
    }, [element]);

    const handleSourceStrategyChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value) as WebCardsSourceStrategy;
        setCardsSourceStrategy(newValue);

        element.strategy = newValue;
        element.sourceDescription = newValue === WebCardsSourceStrategy.Static ? {
            cards: []
        } : {
            cardDescription: {
            }
        };
    }, [element]);

    const handleShowPreview = useCallback(() => {
        openDialog({
            title: 'Preview',
            content: <CardsDemoView element={element} />

        })

    }, [element, openDialog]);

    const handleSendButtonTextChange = useCallback((text: string) => {
        setSendButtonText(text);
        element.sendButtonText = text;
    }, [element]);

    const handleVariableChange = useCallback((newVariable: BotVariable) => {
        setSelectedVariableId(newVariable.id);
        element.variableId = newVariable.id;
    }, [element]);

    const [useCardButtons, setUseCardButtons] = useState<boolean>(element.useCardButtons ?? false);
    const handleUseCardButtonsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked;

        if (newValue) {
            element.buttons = [{
                content: 'Button #1',
                id: 'button-' + v4(),
            }];
        }

        setUseCardButtons(newValue);
        element.useCardButtons = newValue;



    }, [element]);

    const handleShowSendButtonChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked;

        setShowSendButton(newValue);
        element.showSendButton = newValue;
    }, [element]);

    return (
        <Box>
            <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', position: 'relative' }}>
                <FormControlLabel control={<Checkbox checked={selectableCardsValue} onChange={handleSelectableCardsValueChange} />} label="Selectable cards" />
                {selectableCardsValue &&
                    <>
                        <Box sx={{ display: 'flex', width: '100%', flexDirection: 'row', }}>
                            <RadioGroup sx={{ ml: 4 }} row value={multipleChoiceValue} onChange={handleMultipleChoiceValueChange}>
                                <FormControlLabel value={true} control={<Radio />} label="Multiple choice" />
                                <FormControlLabel value={false} control={<Radio />} label="Single choice" />
                            </RadioGroup>
                            {!multipleChoiceValue && <FormControlLabel control={<Checkbox checked={sendResponseOnSelect} onChange={handleSendResponseOnSelectValueChange} />} label="Send response on select" />}
                        </Box>
                        {(multipleChoiceValue || (!sendResponseOnSelect && !multipleChoiceValue)) &&
                            <Box sx={{ ml: 4, padding: (theme) => theme.spacing(1, 0, 1, 0) }}>
                                <AppTextField label="Send button text" value={sendButtonText ?? ''} onValueChange={handleSendButtonTextChange} />
                            </Box>
                        }
                    </>
                }
                <Button sx={{ position: 'absolute', right: 0, top: 0 }} variant="contained" startIcon={<PreviewIcon />} onClick={handleShowPreview}>Preview</Button>

            </Box>

            <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                <Box sx={{ marginBottom: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <RadioGroup sx={{ flex: 1 }} row value={cardsSourceStrategy} onChange={handleSourceStrategyChange}>
                        <FormControlLabel value={WebCardsSourceStrategy.Static} control={<Radio />} label="Static cards" />
                        <FormControlLabel value={WebCardsSourceStrategy.Dynamic} control={<Radio />} label="Dynamic cards" />
                    </RadioGroup>
                </Box>


                {cardsSourceStrategy === WebCardsSourceStrategy.Dynamic && <DynamicCardsEditor element={element} />}
                {cardsSourceStrategy === WebCardsSourceStrategy.Static &&
                    <StaticCardsEditor element={element} />
                }

                {selectableCardsValue &&
                    <Box sx={{ marginTop: 2 }}>
                        <Typography sx={{ marginBottom: 1 }}>
                            Select variable to save user input:
                        </Typography>
                        <VariableSelector valueId={selectedVariableId} onVariableChange={handleVariableChange} />
                    </Box>
                }


                {!selectableCardsValue &&
                    <Box sx={{ marginTop: 1 }}>
                        <FormControlLabel control={<Checkbox checked={useCardButtons} onChange={handleUseCardButtonsChange} />} label="Use card buttons" />


                        {useCardButtons &&
                            <>
                                <Box sx={{ ml: 4, marginBottom: 1 }}>
                                    <FormControlLabel sx={{ marginBottom: 1 }} control={<Checkbox checked={showSendButton} onChange={handleShowSendButtonChange} />} label="Display the 'Send' button when clicking on card buttons is optional." />
                                    {showSendButton && <AppTextField label="Send button text" value={sendButtonText ?? ''} onValueChange={handleSendButtonTextChange} />}
                                </Box>
                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography sx={{ marginBottom: 1 }}>
                                        Select variable to save current card:
                                    </Typography>
                                    <VariableSelector valueId={selectedVariableId} onVariableChange={handleVariableChange} />
                                </Box>
                                <CardButtonsEditor element={element} />
                            </>}
                    </Box>}
            </Box>
        </Box>
    )
}