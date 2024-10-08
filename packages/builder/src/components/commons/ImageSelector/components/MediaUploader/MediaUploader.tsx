import { LinearProgress } from '@mui/material';
import React, { useEffect } from 'react'
import { useUploadMessageAttachments } from '~/components/commons/hooks/useUploadMessageAttachments';
import { AttachEditor } from '~/components/PostCreator/components/AttachEditor';

interface Props {
    onValueChange: (value: string) => void;
    accept?: string;
}

export const MediaUploader = ({ onValueChange, accept }: Props) => {
    const { isUploading, handleAttachmentsAdd, handleAttachmentRemove, uploadedFiles } = useUploadMessageAttachments([], false);

    useEffect(() => {
        const fileUrl = uploadedFiles[0]?.url;
        if (fileUrl) {
            onValueChange(fileUrl);
        }
    }, [uploadedFiles, onValueChange]);

    return (
        <div>
            {isUploading && <LinearProgress sx={{ marginTop: 3 }} />}
            {!isUploading && <AttachEditor fileInputAccept={accept} onAttachmentsAdd={handleAttachmentsAdd} onAttachmentRemove={handleAttachmentRemove} uploadedFiles={uploadedFiles} multiple={false} />}
        </div>
    )
}
