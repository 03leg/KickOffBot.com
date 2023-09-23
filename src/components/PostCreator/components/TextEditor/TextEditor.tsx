import { Box, IconButton } from '@mui/material';
import React, { useCallback } from 'react'
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Colors } from '~/themes/Colors';
import { FormatBold, FormatItalic } from '@mui/icons-material';

interface TextEditorProps {
    onContentChange: (newContent: string) => void;
}

export const TextEditor = ({ onContentChange }: TextEditorProps) => {
    const [editorState, setEditorState] = React.useState<EditorState>(EditorState.createEmpty());

    // const blocks = convertToRaw(editorState.getCurrentContent()).blocks;

    // console.log('blocks', blocks);

    const generatePublicContentChange = useCallback((newState: EditorState) => {
        const content = newState.getCurrentContent();
        const rawObject = convertToRaw(content);
        const jsonContent = JSON.stringify(rawObject);

        onContentChange(jsonContent);
    }, [onContentChange]);

    const handleBoldClick = useCallback(() => {
        const newState = RichUtils.toggleInlineStyle(editorState, 'BOLD');
        setEditorState(newState);
        generatePublicContentChange(newState);
    }, [editorState, generatePublicContentChange]);

    const handleItalicClick = useCallback(() => {
        const newState = RichUtils.toggleInlineStyle(editorState, 'ITALIC');
        setEditorState(newState);
        generatePublicContentChange(newState);
    }, [editorState, generatePublicContentChange]);

    const handleContentChange = useCallback((newState: EditorState) => {
        setEditorState(newState);
        generatePublicContentChange(newState)
    }, [generatePublicContentChange])

    return (
        <Box sx={{ border: `1px solid ${Colors.BORDER}`, padding: ({ spacing }) => (spacing(1)), display: 'flex', flexDirection: 'column' }}>
            <Editor editorState={editorState} onChange={handleContentChange} placeholder="Enter some text..." />

            <Box sx={{ display: 'flex', marginTop: ({ spacing }) => (spacing(2)), justifyContent: 'flex-end' }}>
                <IconButton aria-label="bold" onClick={handleBoldClick}>
                    <FormatBold />
                </IconButton>
                <IconButton aria-label="italic" onClick={handleItalicClick}>
                    <FormatItalic />
                </IconButton>
            </Box>
        </Box>
    )
}
