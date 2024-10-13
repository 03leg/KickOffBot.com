import React from 'react';
import { Box } from '@mui/material';
import { useBotMessageStyles } from './BotMessage.style';
import { BotAvatar } from '../BotAvatar';
import { BotMessageBody, BotMessageBodyType, CardsViewerElement, MediaMessageDescription, MessageDescriptionWebRuntime } from '@kickoffbot.com/types';
import { MessageAndAttachments } from './components/MessageAndAttachments';
import { CardsViewer } from './components/CardsViewer';
import { MediaMessage } from './components/MediaMessage';

interface Props {
    message: BotMessageBody;
    onContentHeightChange: () => void;
}

export const BotMessage = ({ message, onContentHeightChange }: Props) => {
    const { classes } = useBotMessageStyles();

    return (
        <Box className={classes.root} data-testid="BotMessage">
            <Box className={classes.avatar}>
                <BotAvatar />
            </Box>

            {message.type === BotMessageBodyType.MessageAndAttachments && <MessageAndAttachments message={message.content as MessageDescriptionWebRuntime} onContentHeightChange={onContentHeightChange} />}
            {message.type === BotMessageBodyType.Cards && <CardsViewer cardsDescription={message.content as CardsViewerElement} onContentHeightChange={onContentHeightChange} />}
            {message.type === BotMessageBodyType.Media && <MediaMessage content={message.content as MediaMessageDescription} onContentHeightChange={onContentHeightChange} />}
        </Box>
    )
}
