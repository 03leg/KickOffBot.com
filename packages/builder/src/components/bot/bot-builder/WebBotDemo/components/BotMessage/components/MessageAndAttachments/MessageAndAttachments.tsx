import { Box } from '@mui/material'
import React from 'react'
import { AttachmentsViewer } from '../../../AttachmentsViewer';
import { MessageDescriptionWebRuntime } from '@kickoffbot.com/types';
import { useMessageAndAttachmentsStyles } from './useMessageAndAttachments.style';

interface Props {
    message: MessageDescriptionWebRuntime;
    onContentHeightChange: () => void;
}

export const MessageAndAttachments = ({ message, onContentHeightChange }: Props) => {
    const hasAttachments = (message.attachments && message.attachments.length > 0) ?? false;
    const { classes } = useMessageAndAttachmentsStyles({ hasAttachments });

    return (
        <Box className={classes.message}>
            {message.message && <div className={classes.text} dangerouslySetInnerHTML={{ __html: message.message }}></div>}
            {hasAttachments && <AttachmentsViewer attachments={message.attachments!} onContentHeightChange={onContentHeightChange} />}
        </Box>
    )
}
