import React from 'react';
import { Box } from '@mui/material';
import { useUserMessageStyles } from './UserMessage.style';
import { MessageDescriptionWebRuntime } from '@kickoffbot.com/types';

interface Props {
    message: MessageDescriptionWebRuntime;
}

export const UserMessage = ({ message }: Props) => {
    const { classes } = useUserMessageStyles();

    return (
        <Box className={classes.root}>
            <Box className={classes.message}>
                {message.message && <div className={classes.text} dangerouslySetInnerHTML={{ __html: message.message }}></div>}
            </Box>
        </Box>
    )
}
