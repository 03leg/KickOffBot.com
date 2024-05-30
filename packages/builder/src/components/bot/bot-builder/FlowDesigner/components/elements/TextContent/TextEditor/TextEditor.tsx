import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import React, { useCallback } from 'react'
import { Editor, EditorState, Modifier, RichUtils, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Colors } from '~/themes/Colors';
import { FormatBold, FormatItalic } from '@mui/icons-material';
import { stateToHTML } from "draft-js-export-html";
import { VariableType, type BotVariable } from '@kickoffbot.com/types';
import { VariableSelectorDialog } from '../../../VariableSelectorDialog';
import { getTemplateReference, getTextPropertyReference, getTextVariableReference } from '~/components/bot/bot-builder/utils';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { isNil } from 'lodash';
import { StringItemsMenu } from './StringItemsMenu';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import AssignmentIcon from '@mui/icons-material/Assignment';

// import EmojiPicker from 'emoji-picker-react';
// import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

interface TextEditorProps {
    initialState?: EditorState | undefined;
    onContentChange: (jsonState: string, htmlContent: string, telegramContent: string) => void;
    contextObjectProperties?: string[];
    showInsertTemplateButton?: boolean;
}

export const TextEditor = ({ onContentChange, initialState, contextObjectProperties, showInsertTemplateButton = true }: TextEditorProps) => {
    const [editorState, setEditorState] = React.useState<EditorState>(initialState ?? EditorState.createEmpty());

    const { templates } = useFlowDesignerStore((state) => ({
        templates: state.project.templates ?? []
    }));


    // const [showEmojiPicker, setShowEmojiPicker] = React.useState<boolean>(false);

    const generatePublicContentChange = useCallback((newState: EditorState) => {
        const content = newState.getCurrentContent();

        const rawObject = convertToRaw(content);
        const jsonContent = JSON.stringify(rawObject);

        const htmlContent = stateToHTML(newState.getCurrentContent());
        const telegramContent = stateToHTML(newState.getCurrentContent(), {
            inlineStyles: {
                BOLD: { element: 'b' },
            }
        }).replaceAll('<p>', '').replaceAll('</p>', '').replaceAll('<br>', '');

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


    const handleInsertVariable = useCallback((variable: BotVariable, path?: string) => {
        const newState = insertText(getTextVariableReference(variable, path), editorState)

        setEditorState(newState);
        generatePublicContentChange(newState);
    }, [editorState, generatePublicContentChange, insertText]);

    // const handleShowEmojiPicker = useCallback(() => {
    //     setShowEmojiPicker(true);
    // }, []);


    const handleInsertContextPropertyInText = React.useCallback((property: string) => {
        const newState = insertText(getTextPropertyReference(property), editorState);
        setEditorState(newState);
        generatePublicContentChange(newState);
    }, [editorState, generatePublicContentChange, insertText]);

    const handleInsertTemplateInText = React.useCallback((property: string) => {
        const newState = insertText(getTemplateReference(property), editorState);
        setEditorState(newState);
        generatePublicContentChange(newState);
    }, [editorState, generatePublicContentChange, insertText]);

    return (
        <>
            <Box sx={{ border: `1px solid ${Colors.BORDER}`, padding: ({ spacing }) => (spacing(1)), display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <Editor editorState={editorState} onChange={handleContentChange} placeholder="Enter some text..." />

                <Box sx={{ display: 'flex', marginTop: ({ spacing }) => (spacing(2)), justifyContent: 'flex-end' }}>
                    <IconButton aria-label="bold" onClick={handleBoldClick}>
                        <FormatBold />
                    </IconButton>
                    <IconButton aria-label="italic" onClick={handleItalicClick}>
                        <FormatItalic />
                    </IconButton>
                    {/* <IconButton aria-label="italic" onClick={handleShowEmojiPicker}>
                        <InsertEmoticonIcon />
                    </IconButton> */}
                    <VariableSelectorDialog onInsertVariable={handleInsertVariable} supportPathForObject={true} availableVariableTypes={[VariableType.STRING, VariableType.NUMBER, VariableType.BOOLEAN, VariableType.OBJECT]} />
                    {!isNil(contextObjectProperties) && <StringItemsMenu values={contextObjectProperties} onInsertItem={handleInsertContextPropertyInText} buttonIcon={<ControlPointIcon />} />}
                    {showInsertTemplateButton && templates.length > 0 && <StringItemsMenu values={templates.map(t => t.name)} onInsertItem={handleInsertTemplateInText} buttonIcon={<AssignmentIcon />} />}
                </Box>



            </Box>
            {/* {showEmojiPicker && <div style={{ position: 'absolute', right: 0, top: 0, zIndex: 999999 }}><EmojiPicker /></div>} */}
        </>
    )
}