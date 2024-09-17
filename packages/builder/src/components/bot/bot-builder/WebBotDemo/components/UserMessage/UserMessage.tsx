import React from 'react';
import { Box } from '@mui/material';
import { useUserMessageStyles } from './UserMessage.style';
import { BotMessageBody, MessageDescriptionWebRuntime } from '@kickoffbot.com/types';

interface Props {
    responseBody: BotMessageBody;
}

export const UserMessage = ({ responseBody }: Props) => {
    const { classes } = useUserMessageStyles();
    const message = responseBody.content as MessageDescriptionWebRuntime ;

    return (
        <Box className={classes.root}>
            <Box className={classes.message}>
                {message.message && <div className={classes.text} dangerouslySetInnerHTML={{ __html: message.message }}></div>}
            </Box>
        </Box>
    )
}
