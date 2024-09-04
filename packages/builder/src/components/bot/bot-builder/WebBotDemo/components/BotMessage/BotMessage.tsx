import React from 'react';
import { Box } from '@mui/material';
import { useBotMessageStyles } from './BotMessage.style';
import { BotAvatar } from '../BotAvatar';
import { AttachmentsViewer } from '../AttachmentsViewer';
import { MessageDescriptionWebRuntime } from '@kickoffbot.com/types';

interface Props {
    message: MessageDescriptionWebRuntime;
    onContentHeightChange: () => void;
}

export const BotMessage = ({ message, onContentHeightChange }: Props) => {
    const hasAttachments = (message.attachments && message.attachments.length > 0) ?? false;
    const { classes } = useBotMessageStyles({ hasAttachments });

    return (
        <Box className={classes.root}>
            <Box className={classes.avatar}>
                <BotAvatar />
            </Box>
            <Box className={classes.message}>
                {message.message && <div className={classes.text} dangerouslySetInnerHTML={{ __html: message.message }}></div>}
                {hasAttachments && <AttachmentsViewer attachments={message.attachments!} onContentHeightChange={onContentHeightChange} />}
            </Box>
        </Box>
    )
}
