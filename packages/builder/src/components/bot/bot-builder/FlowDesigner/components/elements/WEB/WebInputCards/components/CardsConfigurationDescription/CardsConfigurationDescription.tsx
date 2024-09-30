/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonsSourceStrategy, DynamicSourceDescription, StaticSourceDescription, WebCardsSourceStrategy, WebInputCardsUIElement } from '@kickoffbot.com/types';
import { Alert, Box, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { Card1 } from '../../editor/components/StaticCardsEditor/CardDemoView/Card1';
import { ButtonsInput } from '../../../../ButtonsInput/ButtonsInput';
import { useVariableInTextStyles } from '../../../../ChangeVariable/useContentWithVariable';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { getImageSrc } from '../../editor/getImageSrc';

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
                <Box sx={{ display: 'flex', flexDirection: 'row', padding: 1, overflowY: 'auto' }}>
                    {(element.sourceDescription as StaticSourceDescription).cards.map((card, index) =>
                        <Card1
                            useCardButtons={false}
                            cardButtons={[]}
                            isLast={index === (element.sourceDescription as StaticSourceDescription).cards.length - 1}
                            key={card.id}
                            card={{ ...card, imgUrl: getImageSrc(card.image) }}
                            selectableCard={false} />
                    )}
                </Box>
            </>}
            {element.strategy === WebCardsSourceStrategy.Dynamic &&
                <>
                    Chat bot shows cards based on variable value <span className={classes.variable}>{dataSourceVariable?.name}</span>.&nbsp;
                </>
            }

            {!element.selectableCards && element.useCardButtons && element.buttons && element.buttons.length > 0 &&
                <>
                    <Typography sx={{ marginTop: 2, marginBottom: 1 }}>Each card have <strong>buttons</strong> that you configured.&nbsp;</Typography>
                    <Box sx={{ marginBottom: 1 }}>
                        <ButtonsInput element={{ ...element, strategy: ButtonsSourceStrategy.Manual } as any} />
                    </Box>
                    {variable === null && <Alert severity="error" sx={{ marginTop: 1, marginBottom: 1 }}>Please set a variable to store the card information when the user clicks on a button.</Alert>}
                    {variable !== null && <>The information of the chosen card will be stored in a variable <span className={classes.variable}>{variable?.name}</span>.&nbsp;</>}

                    {element.showSendButton && <><br />Additionally, display the &apos;Send&apos; button if clicking on the card buttons is not required for the user.</>}

                </>
            }

        </Box>
    )
}
