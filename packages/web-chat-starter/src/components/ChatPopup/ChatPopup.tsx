import React from 'react';
import { useChatPopupStyles } from './ChatPopup.style';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { EmbeddedChat } from '../EmbeddedChat';
import { PopupChatInitOptions } from '../../initOptions';

interface Props {
    onClose: () => void;
    options: PopupChatInitOptions;
    shadowRootElement: HTMLDivElement;
}

export const ChatPopup = ({ options, onClose, shadowRootElement }: Props) => {
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
                    <EmbeddedChat initOptions={options} shadowRootElement={shadowRootElement} />
                </Box>
            </Box>
        </Box>
    )
}
