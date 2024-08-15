import { WebContentTextUIElement } from '@kickoffbot.com/types';
import React from 'react'
import { useWebMessageStyles } from './WebMessage.style';
import { Box } from '@mui/material';
import { useParsedProjectEntriesHtml } from '~/components/commons/hooks/useParsedProjectEntriesHtml';
import { AttachmentsViewer } from '~/components/PostCreator/components/AttachmentsViewer/AttachmentsViewer';
import { AttachmentViewer } from '../../../AttachmentViewer';

interface Props {
    element: WebContentTextUIElement;
}

export const WebMessage = ({ element }: Props) => {
    const { classes } = useWebMessageStyles();
    const textContent = useParsedProjectEntriesHtml(element.htmlContent);

    return (
        <Box className={classes.root}>
            <div dangerouslySetInnerHTML={{ __html: textContent ?? 'Message...' }}></div>
            {element.attachments?.length > 1 && <AttachmentsViewer files={element.attachments} />}
            {element.attachments?.length === 1 && <AttachmentViewer file={element.attachments[0]} />}
        </Box>
    )
}
