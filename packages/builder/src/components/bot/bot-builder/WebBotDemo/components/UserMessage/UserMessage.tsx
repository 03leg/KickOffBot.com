import React from 'react';
import { NormalMessage } from '../../types';
import { Box } from '@mui/material';
import { useUserMessageStyles } from './UserMessage.style';

interface Props {
    message: NormalMessage;
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
