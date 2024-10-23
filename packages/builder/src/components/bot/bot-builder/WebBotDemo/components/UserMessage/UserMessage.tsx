import React from 'react';
import { Box } from '@mui/material';
import { useUserMessageStyles } from './UserMessage.style';
import { BotMessageBody, MessageDescriptionWebRuntime, WebViewBotOptions } from '@kickoffbot.com/types';
import { BotAvatar } from '../BotAvatar';

interface Props {
    responseBody: BotMessageBody;
    webViewOptions?: WebViewBotOptions;
}

export const UserMessage = ({ responseBody, webViewOptions }: Props) => {
    const { classes } = useUserMessageStyles();
    const message = responseBody.content as MessageDescriptionWebRuntime;

    return (
        <Box className={classes.root}>
            <Box className={classes.message}>
                {message.message && <div className={classes.text} dangerouslySetInnerHTML={{ __html: message.message }}></div>}
            </Box>

            {(webViewOptions?.userMessageAppearance.avatarSettings?.showAvatar ?? false) && <BotAvatar role='user' avatarSettings={webViewOptions?.userMessageAppearance.avatarSettings} />}
        </Box>
    )
}
