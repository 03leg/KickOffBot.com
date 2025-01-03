import { Box } from '@mui/material'
import React from 'react'
import { useChatBackgroundImageStyles } from './ChatBackgroundImage.style';
import { WebChatTheme } from '@kickoffbot.com/types';

interface Props {
    webViewOptions: WebChatTheme;
}

export const ChatBackgroundImage = ({ webViewOptions }: Props) => {
    const { classes } = useChatBackgroundImageStyles({ webViewOptions });
    return (
        <Box className={classes.root}>

        </Box>
    )
}
