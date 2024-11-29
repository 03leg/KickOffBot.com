/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonsSourceStrategy, DynamicSourceDescription, StaticSourceDescription, WebCardsSourceStrategy, WebInputCardsUIElement } from '@kickoffbot.com/types';
import { Alert, Box, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { ButtonsInput } from '../../../../ButtonsInput/ButtonsInput';
import { useVariableInTextStyles } from '../../../../ChangeVariable/useContentWithVariable';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { Card1 } from '@kickoffbot.com/web-chat';

interface Props {
    element: WebInputCardsUIElement;
}

export const CardsConfigurationDescription = ({ element }: Props) => {
    const { classes } = useVariableInTextStyles();
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    const variable = useMemo(() => {
        if (!element.variableId) {
            return null;
        }
        return getVariableById(element.variableId);
    }, [element.variableId, getVariableById]);


    const dataSourceVariable = useMemo(() => {
        const dynamicDescription = (element.sourceDescription as DynamicSourceDescription);
        if (!dynamicDescription.cardsVariableId) {
            return null;
        }
        return getVariableById(dynamicDescription.cardsVariableId);
    }, [element.sourceDescription, getVariableById]);


    return (
        <Box>

            {element.selectableCards &&
                <>
                    {element.multipleChoice && <>
                        User can select <strong>multiple cards</strong>.&nbsp;
                        {variable !== null &&
                            <>Selected cards will be saved in variable <span className={classes.variable}>{variable?.name}</span>.&nbsp;</>
                        }
                    </>}
                    {!element.multipleChoice && <>User can select <strong>single card</strong>.&nbsp;
                        {variable !== null &&
                            <>Selected card will be saved in variable <span className={classes.variable}>{variable?.name}</span>.&nbsp;</>}</>
                    }

                    {variable === null && <Alert severity="error" sx={{ marginTop: 1, marginBottom: 1 }}>You need to define a variable to store the selected {element.multipleChoice ? 'cards' : 'card'}.</Alert>}
                </>
            }

            {element.strategy === WebCardsSourceStrategy.Static && <>
                The bot displays the cards that you have manually set up.&nbsp;
                <Box sx={{ display: 'flex', flexDirection: 'row', padding: 1, overflowY: 'auto', height: '250px' }} >
                    {(element.sourceDescription as StaticSourceDescription).cards.map((card, index) =>
                        <Card1
                            useCardButtons={false}
                            cardButtons={[]}
                            isLast={index === (element.sourceDescription as StaticSourceDescription).cards.length - 1}
                            key={card.id}
                            card={card}
                            selectableCard={false} />
                    )}
                </Box>
        </>}
{
    element.strategy === WebCardsSourceStrategy.Dynamic &&
    <>
        Chat bot shows cards based on variable value <span className={classes.variable}>{dataSourceVariable?.name}</span>.&nbsp;
    </>
}

{
    !element.selectableCards && element.useCardButtons && element.cardButtons && element.cardButtons.length > 0 &&
    <>
        <Typography sx={{ marginTop: 2, marginBottom: 1 }}>Each card have <strong>buttons</strong> that you configured.&nbsp;</Typography>
        <Box sx={{ marginBottom: 1 }}>
            <ButtonsInput element={{ ...element, buttons: element.cardButtons, strategy: ButtonsSourceStrategy.Manual } as any} />
        </Box>
        {variable === null && <Alert severity="error" sx={{ marginTop: 1, marginBottom: 1 }}>Please set a variable to store the card information when the user clicks on a card button.</Alert>}
        {variable !== null && <>The information of the chosen card will be stored in a variable <span className={classes.variable}>{variable?.name}</span>.&nbsp;</>}
    </>
}
{
    element.useGeneralButtons && element.generalButtons && element.generalButtons.length > 0 &&
    <>
        <Typography sx={{ marginTop: 2, marginBottom: 1 }}>Cards element has <strong>general buttons</strong> that you configured.</Typography>
        <Box sx={{ marginBottom: 1 }}>
            <ButtonsInput element={{ ...element, buttons: element.generalButtons, strategy: ButtonsSourceStrategy.Manual } as any} />
        </Box>
    </>
}

        </Box >
    )
}
