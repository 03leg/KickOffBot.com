import React from 'react';
import { Box } from '@mui/material';

import { BotAvatar } from '../BotAvatar';
import { TypingLoading } from '../TypingLoading';
import { useBotTypingStyles } from './BotTyping.style';
import { WebViewBotOptions } from '@kickoffbot.com/types';

interface Props {
    webViewOptions?: WebViewBotOptions;
}

export const BotTyping = ({ webViewOptions }: Props) => {
    const { classes } = useBotTypingStyles({ hasAttachments: false });

    return (
        <Box className={classes.root}>
            {(webViewOptions?.botMessageAppearance.avatarSettings?.showAvatar ?? true) && <BotAvatar role='bot' avatarSettings={webViewOptions?.botMessageAppearance.avatarSettings} />}

            <Box className={classes.message}>
                <TypingLoading />
            </Box>
        </Box>
    )
}
