import React, { type ReactNode, useMemo } from 'react'
import { ContentType, type FileDescription } from '~/types/ContentEditor'
import { PhotoAttachment } from './PhotoAttachment';
import { FileAttachment } from './FileAttachment';
import { Box } from '@mui/material';
import { Colors } from '~/themes/Colors';

interface AttachmentsViewerProps {
    files: FileDescription[];
    onDelete?: (file: FileDescription) => void;
}

export const AttachmentsViewer = ({ files, onDelete }: AttachmentsViewerProps) => {
    
    const elements = useMemo(() => {
        const result: ReactNode[] = [];

        for (const file of files) {
            if (file.typeContent === ContentType.Image) {
                result.push((<PhotoAttachment onDelete={onDelete} key={file.url} file={file} />));
                continue;
            }

            result.push((<FileAttachment onDelete={onDelete} key={file.url} file={file} />));
        }

        return result;
    }, [files, onDelete]);


    if (files.length === 0) {
        return null;
    }

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            margin: ({ spacing }) => spacing(1, 0),
            padding: ({ spacing }) => spacing(1, 1),
            border: `1px solid ${Colors.BORDER}`,
            overflow: 'auto'
        }}>
            {elements}
        </Box>
    )
}
