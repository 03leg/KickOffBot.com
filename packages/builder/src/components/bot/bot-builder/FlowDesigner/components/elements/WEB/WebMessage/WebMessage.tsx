import { WebContentTextUIElement } from '@kickoffbot.com/types';
import React, { useMemo } from 'react'
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

    const message = useMemo(() => {
        if (textContent) {
            return textContent;
        }

        if (!element.attachments || element.attachments.length === 0) {
            return 'Message...';
        }

        return ''

    }, [element.attachments, textContent]);

    return (
        <Box className={classes.root}>
            <div dangerouslySetInnerHTML={{ __html: message }}></div>
            {element.attachments?.length > 1 && <AttachmentsViewer files={element.attachments} />}
            {element.attachments?.length === 1 && <AttachmentViewer file={element.attachments[0]} />}
        </Box>
    )
}
