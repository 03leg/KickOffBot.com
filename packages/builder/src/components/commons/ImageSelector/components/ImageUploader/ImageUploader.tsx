import { LinearProgress } from '@mui/material';
import React, { useEffect } from 'react'
import { useUploadMessageAttachments } from '~/components/commons/hooks/useUploadMessageAttachments';
import { AttachEditor } from '~/components/PostCreator/components/AttachEditor';

interface Props {
    onValueChange: (value: string) => void;
}

export const ImageUploader = ({ onValueChange }: Props) => {
    const { isUploading, handleAttachmentsAdd, handleAttachmentRemove, uploadedFiles } = useUploadMessageAttachments([], false);

    useEffect(() => {
        const imageUrl = uploadedFiles[0]?.url;
        if (imageUrl) {
            onValueChange(imageUrl);
        }
    }, [uploadedFiles, onValueChange]);

    return (
        <div>
            {isUploading && <LinearProgress sx={{ marginTop: 3 }} />}
            {!isUploading && <AttachEditor fileInputAccept="image/*" onAttachmentsAdd={handleAttachmentsAdd} onAttachmentRemove={handleAttachmentRemove} uploadedFiles={uploadedFiles} multiple={false} />}
        </div>
    )
}
