import React from 'react';
import { Box } from '@mui/material';
import { useBotMessageStyles } from './BotMessage.style';
import { BotAvatar } from '../BotAvatar';
import { BotMessageBody, BotMessageBodyType, CardsViewerElement, MediaMessageDescription, MessageDescriptionWebRuntime, WebChatTheme } from '@kickoffbot.com/types';
import { MessageAndAttachments } from './components/MessageAndAttachments';
import { CardsViewer } from './components/CardsViewer';
import { MediaMessage } from './components/MediaMessage';

interface Props {
    message: BotMessageBody;
    webViewOptions?: WebChatTheme;
    onContentHeightChange: () => void;
}

export const BotMessage = ({ message, onContentHeightChange, webViewOptions }: Props) => {
    const { classes } = useBotMessageStyles();

    return (
        <Box className={classes.root} data-testid="BotMessage">
            {(webViewOptions?.botMessageAppearance.avatarSettings?.showAvatar ?? true) &&
                <BotAvatar avatarSettings={webViewOptions?.botMessageAppearance.avatarSettings} role='bot'/>
            }
            {(webViewOptions?.botMessageAppearance.avatarSettings?.showAvatar === false) &&
                <Box className={classes.noAvatar}></Box>
            }
            {message.type === BotMessageBodyType.MessageAndAttachments && <MessageAndAttachments message={message.content as MessageDescriptionWebRuntime} onContentHeightChange={onContentHeightChange} />}
            {message.type === BotMessageBodyType.Cards && <CardsViewer cardsDescription={message.content as CardsViewerElement} onContentHeightChange={onContentHeightChange} />}
            {message.type === BotMessageBodyType.Media && <MediaMessage content={message.content as MediaMessageDescription} onContentHeightChange={onContentHeightChange} />}
        </Box>
    )
}
