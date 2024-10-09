import { WebContentTextUIElement } from '@kickoffbot.com/types'
import React, { useCallback, useEffect } from 'react'
import { Box, LinearProgress } from '@mui/material'
import { AttachEditor } from '~/components/PostCreator/components/AttachEditor'
import { useUploadMessageAttachments } from '~/components/commons/hooks/useUploadMessageAttachments'
import { WebTextEditor } from '~/components/commons/WebTextEditor'

interface Props {
    element: WebContentTextUIElement
}

export const WebMessageEditor = ({ element }: Props) => {
    const handleContentChange = useCallback((jsonState: string, htmlContent: string) => {
        element.json = jsonState;
        element.htmlContent = htmlContent;
    }, [element]);
    const { isUploading, handleAttachmentsAdd, handleAttachmentRemove, uploadedFiles } = useUploadMessageAttachments(element.attachments);

    useEffect(() => {
        element.attachments = uploadedFiles;
    }, [element, uploadedFiles]);

    return (
        <div>
            <Box sx={{ width: '100%', height: 200 }}>
                <WebTextEditor
                    jsonState={element.json}
                    onContentChange={handleContentChange} />
            </Box>
            {isUploading && <LinearProgress sx={{ marginTop: 3 }} />}
            {!isUploading && <AttachEditor onAttachmentsAdd={handleAttachmentsAdd} onAttachmentRemove={handleAttachmentRemove} uploadedFiles={uploadedFiles} />}
        </div>
    )
}
