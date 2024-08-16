/* eslint-disable @next/next/no-img-element */
import { ContentType, FileDescription } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React, { ReactNode, useMemo } from 'react';
import { useAttachmentsViewerStyles } from './AttachmentsViewer.style';
import { PhotoAttachmentItem } from './components/PhotoAttachmentItem';
import { FileAttachmentItem } from './components/FileAttachmentItem';

interface Props {
    attachments: FileDescription[];
    onContentHeightChange: () => void;
}

export const AttachmentsViewer = ({ attachments, onContentHeightChange }: Props) => {
    const { classes } = useAttachmentsViewerStyles();

    const images = useMemo(() => attachments.filter((attachment) => attachment.typeContent === ContentType.Image), [attachments]);
    const otherFiles = useMemo(() => attachments.filter((attachment) => attachment.typeContent === ContentType.Other), [attachments]);

    const elements = useMemo(() => {
        const result: ReactNode[] = [];

        for (const file of attachments) {
            if (file.typeContent === ContentType.Image) {
                if (images.length !== 1) {
                    result.push((<PhotoAttachmentItem key={file.url} file={file} />));
                }
                continue;
            }

            if (otherFiles.length !== 1) {
                result.push((<FileAttachmentItem key={file.url} file={file} stretch={false} />));
            }
        }

        return result;
    }, [attachments, images.length, otherFiles.length]);

    return (
        <Box className={classes.root}>
            {images.length === 1 && images[0] && <img style={{ marginBottom: otherFiles.length === 0 && elements.length === 0 ? 0 : undefined }} onLoad={() => onContentHeightChange()} className={classes.img} src={images[0].url} alt={images[0].name} title={images[0].name} />}
            {otherFiles.length === 1 && otherFiles[0] && <Box className={classes.file}><FileAttachmentItem file={otherFiles[0]} stretch={true} /></Box>}
            {elements.length > 1 && <Box className={classes.attachmentList}>
                {elements}
            </Box>}
        </Box>
    )
}
