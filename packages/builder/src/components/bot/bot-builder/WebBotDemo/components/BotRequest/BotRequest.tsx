import React, { useMemo } from 'react';
import { RequestDescription } from '../../types';
import { Box } from '@mui/material';
import { ElementType } from '@kickoffbot.com/types';
import { TextBotRequest } from './components/TextBotRequest';
import { useBotRequestStyles } from './BotRequest.style';
import { NumberBoxRequest } from './components/NumberBoxRequest';
import { DateTimeBoxRequest } from './components/DateTimeBoxRequest';
import { PhoneBoxRequest } from './components/PhoneBoxRequest';
import { EmailBoxRequest } from './components/EmailBoxRequest';

interface Props {
    request: RequestDescription;
}

export const BotRequest = ({ request }: Props) => {
    const { classes } = useBotRequestStyles();

    const requestElement = useMemo(() => {
        const elementType = request.element.type;

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
            default: {
                throw new Error('NotImplementedError');
            }
        }

    }, [request]);

    return (
        <Box className={classes.root}>
            {requestElement}
        </Box>
    )
}
