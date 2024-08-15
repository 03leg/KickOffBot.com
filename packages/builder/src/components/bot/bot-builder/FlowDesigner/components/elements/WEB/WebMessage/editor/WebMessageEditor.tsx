import { WebContentTextUIElement } from '@kickoffbot.com/types'
import React, { useCallback, useEffect } from 'react'
import { TextEditor } from '../../../TextEditor'
import { convertFromRaw, EditorState } from 'draft-js'
import { isNil } from 'lodash'
import { LinearProgress } from '@mui/material'
import { AttachEditor } from '~/components/PostCreator/components/AttachEditor'
import { useUploadMessageAttachments } from '~/components/commons/hooks/useUploadMessageAttachments'

interface Props {
    element: WebContentTextUIElement
}

export const WebMessageEditor = ({ element }: Props) => {
    const handleContentChange = useCallback((jsonState: string, htmlContent: string) => {
        element.json = jsonState;
        element.htmlContent = htmlContent;
    }, [element]);
    const initialValue = isNil(element.json) ? void 0 : EditorState.createWithContent(convertFromRaw(JSON.parse(element.json)));
    const { isUploading, handleAttachmentsAdd, handleAttachmentRemove, uploadedFiles } = useUploadMessageAttachments(element.attachments);
    
    
    useEffect(() => {
        element.attachments = uploadedFiles;
    }, [element, uploadedFiles]);

    
    return (
        <div>
            <TextEditor onContentChange={handleContentChange} initialState={initialValue} />
            {isUploading && <LinearProgress sx={{ marginTop: 3 }} />}
            {!isUploading && <AttachEditor onAttachmentsAdd={handleAttachmentsAdd} onAttachmentRemove={handleAttachmentRemove} uploadedFiles={uploadedFiles} />}
        </div>
    )
}
