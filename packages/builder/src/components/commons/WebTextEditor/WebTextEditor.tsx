/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, IconButton } from '@mui/material';
import React, { useCallback } from 'react'
import { DraftInlineStyle, Editor, EditorState, Modifier, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Colors } from '~/themes/Colors';
import { FormatBold, FormatItalic } from '@mui/icons-material';
import { Options, stateToHTML } from "draft-js-export-html";
import { VariableType, type BotVariable } from '@kickoffbot.com/types';
import { getTemplateReference, getTextPropertyReference, getTextVariableReference } from '~/components/bot/bot-builder/utils';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { isNil } from 'lodash';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { EmojiButton } from '~/components/bot/bot-builder/FlowDesigner/components/elements/EmojiButton/EmojiButton';
import { VariableSelectorDialog } from '~/components/bot/bot-builder/FlowDesigner/components/VariableSelectorDialog';
import { StringItemsMenu } from '~/components/bot/bot-builder/FlowDesigner/components/elements/TextEditor/StringItemsMenu';
import { ColorPickerButton, CssProperty } from './components/ColorPickerButton';
import { FontSizeButton } from './components/FontSizeButton';
import { handleDraftEditorPastedText, onDraftEditorCopy, onDraftEditorCut } from 'draftjs-conductor';
import { NewLinkButton } from './components/NewLinkButton';
import { draftJsEditorDecorator, useNewLink } from './components/NewLinkButton/useNewLink';


interface Props {
    jsonState?: string | undefined;
    onContentChange: (jsonState: string, htmlContent: string) => void;
    contextObjectProperties?: string[];
    showInsertTemplateButton?: boolean;
}

export const CUSTOM_STYLE_PREFIX_COLOR = 'color_';
export const CUSTOM_STYLE_PREFIX_FONT_SIZE = 'font_size_';
export const CUSTOM_STYLE_PREFIX_BACKGROUND_COLOR = 'background_color_';

export const WebTextEditor = ({ onContentChange, jsonState, contextObjectProperties, showInsertTemplateButton = true }: Props) => {
    const { templates } = useFlowDesignerStore((state) => ({
        templates: state.project.templates ?? []
    }));

    const initialState = isNil(jsonState) ? EditorState.createEmpty(draftJsEditorDecorator) : EditorState.createWithContent(convertFromRaw(JSON.parse(jsonState)), draftJsEditorDecorator);
    const [editorState, setEditorState] = React.useState<EditorState>(initialState);
    const { handleAddLink } = useNewLink(editorState, (newState, contentChanged) => {
        setEditorState(newState);
        if (contentChanged) {
            generatePublicContentChange(newState);
        }
    });


    const generatePublicContentChange = useCallback((newState: EditorState) => {
        const plainText = newState.getCurrentContent().getPlainText();
        const content = newState.getCurrentContent();

        const rawObject = convertToRaw(content);
        const jsonContent = JSON.stringify(rawObject);

        const options: Options & { inlineStyleFn: (styles: any) => any } = {
            inlineStyleFn: (styles: any) => {

                const color = styles.filter((value: any) => value.startsWith(CUSTOM_STYLE_PREFIX_COLOR)).first();
                const fontSize = styles.filter((value: any) => value.startsWith(CUSTOM_STYLE_PREFIX_FONT_SIZE)).first();
                const backgroundColor = styles.filter((value: any) => value.startsWith(CUSTOM_STYLE_PREFIX_BACKGROUND_COLOR)).first();

                if (color || fontSize || backgroundColor) {
                    return {
                        element: 'span',
                        style: {
                            color: color?.replace(CUSTOM_STYLE_PREFIX_COLOR, '') ?? 'unset',
                            fontSize: fontSize?.replace(CUSTOM_STYLE_PREFIX_FONT_SIZE, '') ?? 'unset',
                            backgroundColor: backgroundColor?.replace(CUSTOM_STYLE_PREFIX_BACKGROUND_COLOR, '') ?? 'unset',
                            // if background color is set, add 2px border radius to the left and right
                            // borderRadius: backgroundColor === undefined ? 'unset' : '2px',
                            // paddingLeft: backgroundColor === undefined ? 'unset' : '3px',
                            // paddingRight: backgroundColor === undefined ? 'unset' : '3px',
                        },
                    };
                }
            },
            entityStyleFn: (entity) => {
                const entityType = entity.getType().toLowerCase();
                if (entityType === 'link') {
                    const data = entity.getData();

                    return {
                        element: 'a',
                        attributes: {
                            href: data.linkUrl,
                            target: "_blank"
                        },
                        style: {
                            'text-decoration-color': data.linkTextColor ?? 'unset'
                        },
                    };
                }
            },
        };

        //.replaceAll('<p>', '').replaceAll('</p>', '')
        const htmlContent = plainText === '' ? '' : stateToHTML(newState.getCurrentContent(), options);

        onContentChange(jsonContent, htmlContent);
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

    const handleInsertEmoji = useCallback((emoji: string) => {
        const newState = insertText(emoji, editorState);
        setEditorState(newState);
        generatePublicContentChange(newState);
    }, [editorState, generatePublicContentChange, insertText]);

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

    const handleColorChange = useCallback((hexColor: string, propertyType: CssProperty) => {
        const customStyleProp = propertyType === CssProperty.Color ? CUSTOM_STYLE_PREFIX_COLOR : CUSTOM_STYLE_PREFIX_BACKGROUND_COLOR;

        const styles = editorState.getCurrentInlineStyle().toJS();
        let nextEditorState = styles.reduce((state: EditorState, styleKey: string) => {
            if (styleKey.startsWith(customStyleProp)) {
                return RichUtils.toggleInlineStyle(state, styleKey);
            }
            return state;
        }, editorState);

        if (hexColor != null) {
            nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, customStyleProp + hexColor);
        }

        setEditorState(nextEditorState);
        generatePublicContentChange(nextEditorState);
    }, [editorState, generatePublicContentChange]);

    const handleFontSizeChange = useCallback((fontSize: number) => {
        const styles = editorState.getCurrentInlineStyle().toJS();
        let nextEditorState = styles.reduce((state: EditorState, styleKey: string) => {
            if (styleKey.startsWith(CUSTOM_STYLE_PREFIX_FONT_SIZE)) {
                return RichUtils.toggleInlineStyle(state, styleKey);
            }
            return state;
        }, editorState);

        if (fontSize != null) {
            nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, CUSTOM_STYLE_PREFIX_FONT_SIZE + fontSize);
        }

        setEditorState(nextEditorState);
        generatePublicContentChange(nextEditorState);

    }, [editorState, generatePublicContentChange]);

    const customStyleFn = useCallback((style: DraftInlineStyle) => {
        const styleNames = style.toJS();

        return styleNames.reduce((styles: Record<string, any>, styleName: string) => {
            if (styleName.startsWith(CUSTOM_STYLE_PREFIX_COLOR)) {
                styles.color = styleName.split(CUSTOM_STYLE_PREFIX_COLOR)[1];
            }

            if (styleName.startsWith(CUSTOM_STYLE_PREFIX_BACKGROUND_COLOR)) {
                styles.backgroundColor = styleName.split(CUSTOM_STYLE_PREFIX_BACKGROUND_COLOR)[1];
            }

            if (styleName.startsWith(CUSTOM_STYLE_PREFIX_FONT_SIZE)) {
                styles.fontSize = styleName.split(CUSTOM_STYLE_PREFIX_FONT_SIZE)[1] + 'px';
            }
            return styles;
        }, {});
    }, []);

    const handlePastedText = useCallback((text: string, html: string | undefined) => {
        if (html) {
            const newState = handleDraftEditorPastedText(html, editorState) ?? editorState;
            if (newState) {
                setEditorState(newState);
                generatePublicContentChange(newState);

                return 'handled';
            }
        }
        return 'not-handled';
    }, [editorState, generatePublicContentChange]);

    const handleAddLinkClick = useCallback((url: string, title?: string) => {
        handleAddLink(url, title);
    }, [handleAddLink])

    return (
        <>
            <Box sx={{ height: '100%', border: `1px solid ${Colors.BORDER}`, padding: ({ spacing }) => (spacing(1)), display: 'flex', flexDirection: 'column', position: 'relative' }}>

                <Box sx={{ height: 'calc(100% - 40px)', overflowY: 'auto' }}>
                    <Editor editorState={editorState}
                        onCopy={onDraftEditorCopy}
                        onCut={onDraftEditorCut}
                        onChange={handleContentChange}
                        customStyleFn={customStyleFn}
                        handlePastedText={handlePastedText}
                        placeholder="Enter some text..." />
                </Box>

                <Box sx={{ display: 'flex', marginTop: ({ spacing }) => (spacing(2)), justifyContent: 'flex-end' }}>
                    <NewLinkButton onAddLink={handleAddLinkClick} showTitleEditor={editorState.getSelection().isCollapsed()} />
                    <ColorPickerButton onColorChange={handleColorChange} />
                    <FontSizeButton onFontSizeChange={handleFontSizeChange} />
                    <IconButton aria-label="bold" onClick={handleBoldClick}>
                        <FormatBold />
                    </IconButton>
                    <IconButton aria-label="italic" onClick={handleItalicClick}>
                        <FormatItalic />
                    </IconButton>

                    <EmojiButton onInsertEmoji={handleInsertEmoji} />

                    <VariableSelectorDialog onInsertVariable={handleInsertVariable} supportPathForObject={true} availableVariableTypes={[VariableType.STRING, VariableType.NUMBER, VariableType.BOOLEAN, VariableType.OBJECT]} />
                    {!isNil(contextObjectProperties) && <StringItemsMenu values={contextObjectProperties} onInsertItem={handleInsertContextPropertyInText} buttonIcon={<ControlPointIcon />} />}
                    {showInsertTemplateButton && templates.length > 0 && <StringItemsMenu values={templates.map(t => t.name)} onInsertItem={handleInsertTemplateInText} buttonIcon={<AssignmentIcon />} />}
                </Box>
            </Box>

        </>
    )
}

