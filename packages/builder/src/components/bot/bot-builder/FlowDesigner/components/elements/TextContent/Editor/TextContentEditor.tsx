import { Box, LinearProgress } from '@mui/material'
import { EditorState, convertFromRaw } from 'draft-js';
import { isNil } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react'
import { type ContentTextUIElement } from '@kickoffbot.com/types';
import { TextEditor } from '../TextEditor';
import { AttachEditor } from '~/components/PostCreator/components/AttachEditor';
import { ClientFileDescription, ContentType, FileDescription } from '~/types/ContentEditor';
import { UploadAttachmentFileDescription } from '~/types/UploadAttachments';
import { uploadAttachments } from '~/components/PostCreator/utils';
import { showError, showSuccessMessage } from '~/utils/ClientStatusMessage';
import { throwIfNil } from '~/utils/guard';
import { IMAGE_EXTENSIONS } from '~/components/PostCreator/components/AttachEditor/constants';

interface Props {
    element: ContentTextUIElement;
}

export const TextContentEditor = ({ element }: Props) => {
    const handleContentChange = useCallback((jsonState: string, htmlContent: string, telegramContent: string) => {
        element.json = jsonState;
        element.htmlContent = htmlContent;
        element.telegramContent = telegramContent;
    }, [element]);
    const a = isNil(element.json) ? void 0 : EditorState.createWithContent(convertFromRaw(JSON.parse(element.json)));

    const [uploadedFiles, setUploadedFiles] = useState<FileDescription[]>(element.attachments ?? []);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    useEffect(() => {
        element.attachments = uploadedFiles;
    }, [element, uploadedFiles]);

    const handleAttachmentsAdd = useCallback(async (files: FileDescription[]) => {
        setIsUploading(true);

        let attachments: UploadAttachmentFileDescription[] = [];
        try {
            attachments = await uploadAttachments(files.map((f) => (f as ClientFileDescription).browserFile));
        }
        catch {
            showError('Failed to save your post... Sorry 😔');
            return;
        }

        const newFiles = attachments.map(file => {
            throwIfNil(file.name);

            const fileExt = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
            const result = { name: file.name, size: file.size, typeContent: IMAGE_EXTENSIONS.includes(fileExt) ? ContentType.Image : ContentType.Other, url: file.storageUrl } as FileDescription;

            return result;
        });

        showSuccessMessage('Your files uploaded!');
        setUploadedFiles([...uploadedFiles, ...newFiles]);
        setIsUploading(false);
    }, [uploadedFiles]);

    const handleAttachmentRemove = useCallback((file: FileDescription) => {
        setUploadedFiles([...uploadedFiles.filter(f => f.url !== file.url)]);
    }, [uploadedFiles]);

    return (
        <Box sx={{ flex: 1 }}>
            <TextEditor onContentChange={handleContentChange} initialState={a} />
            {isUploading && <LinearProgress sx={{ marginTop: 3 }} />}
            {!isUploading && <AttachEditor onAttachmentsAdd={handleAttachmentsAdd} onAttachmentRemove={handleAttachmentRemove} uploadedFiles={uploadedFiles} />}
        </Box>
    )
}
