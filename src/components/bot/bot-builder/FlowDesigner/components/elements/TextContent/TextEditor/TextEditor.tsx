import { Box, IconButton } from '@mui/material';
import React, { useCallback } from 'react'
import { Editor, EditorState, Modifier, RichUtils, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Colors } from '~/themes/Colors';
import { FormatBold, FormatItalic } from '@mui/icons-material';
import { stateToHTML } from "draft-js-export-html";
import { type BotVariable } from '~/components/bot/bot-builder/types';
import { VariableSelectorDialog } from '../../../VariableSelectorDialog';
import { getTextVariableReference } from '~/components/bot/bot-builder/utils';


interface TextEditorProps {
    initialState?: EditorState | undefined;
    onContentChange: (jsonState: string, htmlContent: string, telegramContent: string) => void;
}

export const TextEditor = ({ onContentChange, initialState }: TextEditorProps) => {
    const [editorState, setEditorState] = React.useState<EditorState>(initialState ?? EditorState.createEmpty());
    // const [selectedVariableInsert, setSelectedVariableInsert] = useState<BotVariable | null>(null);

    const generatePublicContentChange = useCallback((newState: EditorState) => {
        const content = newState.getCurrentContent();

        const rawObject = convertToRaw(content);
        const jsonContent = JSON.stringify(rawObject);

        const htmlContent = stateToHTML(newState.getCurrentContent());
        const telegramContent = stateToHTML(newState.getCurrentContent());

        onContentChange(jsonContent, htmlContent, telegramContent);
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
    }, [generatePublicContentChange]);

    const insertText = useCallback((text: string, editorState: EditorState) => {
        const currentContent = editorState.getCurrentContent(),
            currentSelection = editorState.getSelection();

        const newContent = Modifier.replaceText(
            currentContent,
            currentSelection,
            text
        );

        const newEditorState = EditorState.push(editorState, newContent, 'insert-characters');
        return EditorState.forceSelection(newEditorState, newContent.getSelectionAfter());
    }, []);


    const handleInsertVariable = useCallback((variable: BotVariable) => {
        const newState = insertText(getTextVariableReference(variable), editorState)

        setEditorState(newState);
        generatePublicContentChange(newState);
    }, [editorState, generatePublicContentChange, insertText]);

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
                <VariableSelectorDialog onInsertVariable={handleInsertVariable} />
            </Box>
        </Box>
    )
}