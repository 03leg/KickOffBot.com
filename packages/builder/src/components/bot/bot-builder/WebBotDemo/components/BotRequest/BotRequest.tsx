import React, { useMemo } from 'react';
import { Box, Rating } from '@mui/material';
import { ElementType, RequestDescriptionWebRuntime } from '@kickoffbot.com/types';
import { TextBotRequest } from './components/TextBotRequest';
import { useBotRequestStyles } from './BotRequest.style';
import { NumberBoxRequest } from './components/NumberBoxRequest';
import { DateTimeBoxRequest } from './components/DateTimeBoxRequest';
import { PhoneBoxRequest } from './components/PhoneBoxRequest';
import { EmailBoxRequest } from './components/EmailBoxRequest';
import { ButtonsBoxRequest } from './components/ButtonsBoxRequest';
import { CardsBoxRequest } from './components/CardsBoxRequest';
import { OpinionScaleRequest } from './components/OpinionScaleRequest';
import { RatingBoxRequest } from './components/RatingBoxRequest';

interface Props {
    request: RequestDescriptionWebRuntime;
    onContentHeightChange: () => void;
}

export const BotRequest = ({ request, onContentHeightChange }: Props) => {
    const { classes } = useBotRequestStyles();

    const requestElement = useMemo(() => {
        const elementType = request.element.elementType;

        switch (elementType) {
            case ElementType.WEB_INPUT_TEXT: {
                return <TextBotRequest request={request} />
            }
            case ElementType.WEB_INPUT_NUMBER: {
                return <NumberBoxRequest request={request} />
            }
            case ElementType.WEB_INPUT_DATE_TIME: {
                return <DateTimeBoxRequest request={request} />
            }
            case ElementType.WEB_INPUT_PHONE:{
                return <PhoneBoxRequest request={request} />
            }
            case ElementType.WEB_INPUT_EMAIL: {
                return <EmailBoxRequest request={request} />
            }
            case ElementType.WEB_INPUT_BUTTONS:{
                return <ButtonsBoxRequest request={request} />
            }
            case ElementType.WEB_INPUT_CARDS: {
                return <CardsBoxRequest request={request} onContentHeightChange={onContentHeightChange} />
            }
            case ElementType.WEB_OPINION_SCALE: {
                return <OpinionScaleRequest request={request} />
            }
            case ElementType.WEB_RATING:{
                return <RatingBoxRequest request={request} />
            }
            default: {
                throw new Error('NotImplementedError');
            }
        }

    }, [onContentHeightChange, request]);

    return (
        <Box data-testid="BotRequest" className={classes.root}>
            {requestElement}
        </Box>
    )
}
