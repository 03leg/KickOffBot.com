import { Box, Button } from '@mui/material'
import React, { type SyntheticEvent, useCallback, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { isNil, remove } from 'lodash';
import { ClientFileDescription, ContentType, type FileDescription } from '~/types/ContentEditor';
import { IMAGE_EXTENSIONS } from './constants';
import { AttachmentsViewer } from '../AttachmentsViewer/AttachmentsViewer';
import { getSizeString } from './utility';


interface AttachEditorProps {
    onAttachmentsChange: (files: FileDescription[]) => void;
}

export const AttachEditor = ({ onAttachmentsChange }: AttachEditorProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<FileDescription[]>([]);

    const handleFileInputChange = useCallback((event: SyntheticEvent<HTMLInputElement>) => {
        const files = (event.target as HTMLInputElement).files;

        if (isNil(files)) {
            return;
        }

        const fileDescriptions: ClientFileDescription[] = [];
        for (const file of Array.from(files)) {
            const fileExt = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
            fileDescriptions.push({
                url: URL.createObjectURL(file), typeContent: IMAGE_EXTENSIONS.includes(fileExt) ? ContentType.Image : ContentType.Other, name: file.name,
                size: getSizeString(file.size, 1),
                browserFile: file
            });
        }

        setSelectedFiles(fileDescriptions);
        onAttachmentsChange(fileDescriptions);
    }, [onAttachmentsChange]);

    const handleAddFilesClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleAttachmentDelete = useCallback((file: FileDescription) => {
        const items = [...selectedFiles];
        remove(items, file);
        setSelectedFiles(items);
    }, [selectedFiles]);

    return (
        <Box sx={{ marginTop: (theme) => theme.spacing(2), display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button color='success' variant="contained" startIcon={<AddIcon />} onClick={handleAddFilesClick}>Add files</Button>
                <input
                    hidden
                    multiple
                    ref={fileInputRef}
                    type='file'
                    className='custom-file-input'
                    id='customFile'
                    onChange={handleFileInputChange}
                />
            </Box>
            <AttachmentsViewer files={selectedFiles} onDelete={handleAttachmentDelete} />
        </Box>
    )
}
