import React from 'react';
import { Box } from '@mui/material';

import { BotAvatar } from '../BotAvatar';
import { TypingLoading } from '../TypingLoading';
import { useBotMessageStyles } from '../BotMessage/BotMessage.style';

export const BotTyping = () => {
    const { classes } = useBotMessageStyles({ hasAttachments: false });

    return (
        <Box className={classes.root}>
            <Box className={classes.avatar}>
                <BotAvatar />
            </Box>
            <Box className={classes.message}>
                <TypingLoading />
            </Box>
        </Box>
    )
}
