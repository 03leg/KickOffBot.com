import { Box, Checkbox, FormControlLabel, LinearProgress } from '@mui/material'
import { EditorState, convertFromRaw } from 'draft-js';
import { isNil } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react'
import { MessageContentDescription } from '@kickoffbot.com/types';
import { TextEditor } from '../TextEditor';
import { AttachEditor } from '~/components/PostCreator/components/AttachEditor';
import { ClientFileDescription } from '~/types/ContentEditor';
import { ContentType, FileDescription } from '@kickoffbot.com/types';
import { UploadAttachmentFileDescription } from '~/types/UploadAttachments';
import { uploadAttachments } from '~/components/PostCreator/utils';
import { showError, showSuccessMessage } from '~/utils/ClientStatusMessage';
import { throwIfNil } from '~/utils/guard';
import { IMAGE_EXTENSIONS } from '~/components/PostCreator/components/AttachEditor/constants';
import { ButtonsEditor } from '../../ButtonsInput/Editor';

interface Props {
    element: MessageContentDescription;
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
    const [showButtons, setShowButtons] = useState<boolean>(element.showButtons ?? false);
    const [disableButtons, setDisableButtons] = useState<boolean>(element.attachments === undefined || element.attachments.length === 0 ? false : true);

    useEffect(() => {
        element.attachments = uploadedFiles;

        setDisableButtons(uploadedFiles.length > 1);
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

    const handleClickUseButtons = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setShowButtons(event.target.checked);
        element.showButtons = event.target.checked;
    }, [element]);

    return (
        <Box sx={{ flex: 1 }}>
            <TextEditor onContentChange={handleContentChange} initialState={a} />
            {isUploading && <LinearProgress sx={{ marginTop: 3 }} />}
            {!isUploading && <AttachEditor onAttachmentsAdd={handleAttachmentsAdd} onAttachmentRemove={handleAttachmentRemove} uploadedFiles={uploadedFiles} />}
            <FormControlLabel disabled={disableButtons} sx={{ marginTop: 2 }} control={<Checkbox checked={showButtons} onChange={handleClickUseButtons} />} label="Show buttons" />
            {showButtons && !disableButtons && <ButtonsEditor element={element.buttonsDescription} />}
        </Box>
    )
}
