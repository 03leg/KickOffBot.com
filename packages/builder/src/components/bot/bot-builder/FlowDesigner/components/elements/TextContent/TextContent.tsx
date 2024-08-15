import { Box, Divider } from '@mui/material';
import React from 'react'
import { makeStyles } from 'tss-react/mui';
import { ElementType, MessageContentDescription } from '@kickoffbot.com/types';
import { AttachmentsViewer } from '~/components/PostCreator/components/AttachmentsViewer/AttachmentsViewer';
import { AttachmentViewer } from '../../AttachmentViewer';
import { ButtonsInput } from '../ButtonsInput/ButtonsInput';
import { useParsedProjectEntriesHtml } from '~/components/commons/hooks/useParsedProjectEntriesHtml';

interface Props {
    element: MessageContentDescription;
    elementId: string;
}

export const useStyles = makeStyles()(() => ({
    root: {
        '& p': {
            margin: 0
        }
    }
}));


export const TextContent = ({ element, elementId }: Props) => {
    const contentTextElement = element;
    const { classes } = useStyles();

    const textContent = useParsedProjectEntriesHtml(contentTextElement.htmlContent);

    return (
        <Box className={classes.root}>
            <div dangerouslySetInnerHTML={{ __html: textContent ?? 'Message...' }}></div>
            {contentTextElement.attachments?.length > 1 && <AttachmentsViewer files={contentTextElement.attachments} />}
            {contentTextElement.attachments?.length === 1 && <AttachmentViewer file={contentTextElement.attachments[0]} />}
            {contentTextElement.showButtons &&
                <>
                    <Divider sx={{ marginTop: 2 }} />
                    <Box sx={{ marginTop: 2 }}>
                        <ButtonsInput element={{ ...contentTextElement.buttonsDescription, id: elementId, type: ElementType.INPUT_BUTTONS }} />
                    </Box>
                </>
            }
        </Box>
    )
}
