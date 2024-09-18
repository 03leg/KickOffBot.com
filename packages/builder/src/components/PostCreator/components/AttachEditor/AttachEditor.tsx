import { Box, Button } from '@mui/material'
import React, { type SyntheticEvent, useCallback, useRef } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { isNil } from 'lodash';
import { ClientFileDescription } from '~/types/ContentEditor';

import { IMAGE_EXTENSIONS, VIDEO_EXTENSIONS } from './constants';
import { AttachmentsViewer } from '../AttachmentsViewer/AttachmentsViewer';
import { ContentType, FileDescription } from '@kickoffbot.com/types';


interface AttachEditorProps {
    onAttachmentsAdd: (files: ClientFileDescription[]) => void;
    onAttachmentRemove: (file: FileDescription) => void;
    uploadedFiles: FileDescription[];
    multiple?: boolean;
    fileInputAccept?: string;
}

export const AttachEditor = ({ onAttachmentsAdd, onAttachmentRemove, uploadedFiles, multiple = true, fileInputAccept }: AttachEditorProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileInputChange = useCallback((event: SyntheticEvent<HTMLInputElement>) => {
        const files = (event.target as HTMLInputElement).files;

        if (isNil(files)) {
            return;
        }

        const fileDescriptions: ClientFileDescription[] = [];
        for (const file of Array.from(files)) {
            const fileExt = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
            fileDescriptions.push({
                url: URL.createObjectURL(file), typeContent: IMAGE_EXTENSIONS.includes(fileExt) ? ContentType.Image : (VIDEO_EXTENSIONS.includes(fileExt) ? ContentType.Video : ContentType.Other), name: file.name,
                size: file.size, 
                browserFile: file
            });
        }
        onAttachmentsAdd(fileDescriptions);
    }, [onAttachmentsAdd]);

    const handleAddFilesClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleAttachmentDelete = useCallback((file: FileDescription) => {
        onAttachmentRemove(file);
    }, [onAttachmentRemove]);

    return (
        <Box sx={{ marginTop: (theme) => theme.spacing(2), display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button color='success' variant="contained" startIcon={<AddIcon />} onClick={handleAddFilesClick}>Upload from your device</Button>
                <input
                    hidden
                    multiple={multiple}
                    ref={fileInputRef}
                    type='file'
                    className='custom-file-input'
                    id='customFile'
                    onChange={handleFileInputChange}
                    accept={fileInputAccept}
                />
            </Box>
            <AttachmentsViewer files={uploadedFiles} onDelete={handleAttachmentDelete} />
        </Box>
    )
}
