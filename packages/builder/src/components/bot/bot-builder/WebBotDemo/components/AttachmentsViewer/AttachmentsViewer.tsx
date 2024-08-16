import { ContentType, FileDescription } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React, { ReactNode, useMemo } from 'react';
import { useAttachmentsViewerStyles } from './AttachmentsViewer.style';
import { FileAttachmentItem } from './components/FileAttachmentItem';
import { MediaViewer } from './components/MediaViewer';

interface Props {
    attachments: FileDescription[];
    onContentHeightChange: () => void;
}

export const AttachmentsViewer = ({ attachments, onContentHeightChange }: Props) => {
    const { classes, cx } = useAttachmentsViewerStyles();

    const imageAndVideoItems = useMemo(() => attachments.filter((attachment) => [ContentType.Video, ContentType.Image].includes(attachment.typeContent)), [attachments]);
    const otherFiles = useMemo(() => attachments.filter((attachment) => attachment.typeContent === ContentType.Other), [attachments]);

    console.log('attachments', attachments)

    const elements = useMemo(() => {
        const result: ReactNode[] = [];

        for (const file of otherFiles) {
            result.push((<FileAttachmentItem key={file.url} file={file} stretch={otherFiles.length === 1} />));
        }

        return result;
    }, [otherFiles]);

    return (
        <Box className={classes.root}>
            {imageAndVideoItems.length > 0 &&
                <Box sx={{ marginBottom: ({ spacing }) => elements.length === 0 ? 0 : spacing(1) }}>
                    <MediaViewer items={imageAndVideoItems} onContentHeightChange={onContentHeightChange} />
                </Box>
            }
            {
                elements.length !== 0 && <Box className={cx(elements.length > 1 ? classes.attachmentItems : '', elements.length === 1 ? classes.attachmentItem : '')}>
                    {elements}
                </Box>
            }


        </Box >
    )
}
