import React from 'react';
import { Box } from '@mui/material';

import { BotAvatar } from '../BotAvatar';
import { TypingLoading } from '../TypingLoading';
import { useBotTypingStyles } from './BotTyping.style';

export const BotTyping = () => {
    const { classes } = useBotTypingStyles({ hasAttachments: false });

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
