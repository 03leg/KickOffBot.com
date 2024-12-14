import { WebBotLogMessage } from '@kickoffbot.com/types'
import { Box } from '@mui/material'
import React, { useMemo } from 'react'
import { useBotMessageViewerStyles } from './BotMessageViewer.style'

interface Props {
    message: WebBotLogMessage
}

export const BotMessageViewer = ({ message }: Props) => {
    const { classes } = useBotMessageViewerStyles();

    const messageWithoutHtml = useMemo(() => {
        const element = document.createElement('div');
        element.innerHTML = message.message;

        return element.textContent;
    }, [message.message]);

    return (
        <span className={classes.root}>
            {messageWithoutHtml}
            {message.attachmentsCount > 0 && ` (${message.attachmentsCount} attachments)`}
        </span>
    )
}
