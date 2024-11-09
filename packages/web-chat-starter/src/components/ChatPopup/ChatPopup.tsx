import React from 'react'
import { useChatPopupStyles } from './ChatPopup.style';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { ChatViewer } from '@kickoffbot.com/web-chat';
import { WebChatTheme } from '@kickoffbot.com/types';

interface Props {
    botId: string;
    chatTheme: WebChatTheme;
    onClose: () => void;
}

export const ChatPopup = ({ botId, chatTheme, onClose }: Props) => {
    const { classes } = useChatPopupStyles();

    return (
        <Box className={classes.root}>
            <Box className={classes.popup}>
                <Box className={classes.header}>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        className={classes.closeButton}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box className={classes.content}>
                    <ChatViewer height={"100%"} projectId={botId} webViewOptions={chatTheme} runtimeUrl={process.env.NEXT_PUBLIC_WEB_BOT_RUNTIME_HOST!} />
                </Box>
            </Box>
        </Box>
    )
}
