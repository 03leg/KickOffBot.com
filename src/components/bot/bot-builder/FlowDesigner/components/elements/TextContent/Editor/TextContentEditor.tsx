import { Box } from '@mui/material'
import { EditorState, convertFromRaw } from 'draft-js';
import { isNil } from 'lodash';
import React, { useCallback } from 'react'
import { TextEditor } from '~/components/PostCreator/components/TextEditor';
import { type ContentTextUIElement } from '~/components/bot/bot-builder/types';

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


    return (
        <Box sx={{ flex: 1 }}>
            <TextEditor onContentChange={handleContentChange} initialState={a} />
            {/* <AttachEditor onAttachmentsChange={handleAttachmentsChange} /> */}
        </Box>
    )
}
