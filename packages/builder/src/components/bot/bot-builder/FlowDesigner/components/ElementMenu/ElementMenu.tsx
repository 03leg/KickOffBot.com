import { Box, Breakpoint, Button, IconButton } from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Colors } from '~/themes/Colors';
import { useFlowDesignerStore } from '../../../store';
import { isNil, remove } from 'lodash';
import { useConfirm } from 'material-ui-confirm';
import { TextContentEditor } from '../elements/TextContent/Editor';
import { ButtonsEditor } from '../elements/ButtonsInput/Editor';
import { TextInputEditor } from '../elements/TextInput/Editor';
import { ChangeVariableUIElement, ConditionUIElement, ContentTextUIElement, EditMessageUIElement, ElementType, GoogleSheetsIntegrationUIElement, HTTPRequestIntegrationUIElement, InputButtonsUIElement, InputTextUIElement, OutputPortDescription, RemoveMessageUIElement, SendTelegramMessageIntegrationUIElement, UIElement, WebContentMediaUIElement, WebContentTextUIElement, WebInputButtonsUIElement, WebInputCardsUIElement, WebInputDateTimeUIElement, WebInputEmailUIElement, WebInputNumberUIElement, WebInputPhoneUIElement, WebInputTextUIElement, WebLogicRemoveMessagesUIElement, WebMediaType, WebOpinionScaleUIElement, WebRatingUIElement } from '@kickoffbot.com/types';
import { ChangeVariableEditor } from '../elements/ChangeVariable/Editor';
import { ConditionEditor } from '../elements/Condition/Editor';
import { EditMessageEditor } from '../elements/EditMessage/Editor';
import { RemoveMessageEditor } from '../elements/RemoveMessage/Editor/RemoveMessageEditor';
import { IntegrationSendTelegramMessageEditor } from '../elements/IntegrationSendTelegramMessage/Editor';
import { IntegrationGoogleSheetsEditor } from '../elements/IntegrationGoogleSheets/Editor/IntegrationGoogleSheetsEditor';
import { IntegrationHttpRequestEditor } from '../elements/IntegrationHttpRequest';
import { useAppDialog } from '../../../Dialog/useAppDialog';
import { WebMessageEditor } from '../elements/WEB/WebMessage';
import { WebTextInputEditor } from '../elements/WEB/WebTextInput/editor';
import { WebNumberInputEditor } from '../elements/WEB/WebNumberInput/editor/WebNumberInputEditor';
import { WebDateTimeInputEditor } from '../elements/WEB/WebDateTimeInput/editor';
import { WebPhoneInputEditor } from '../elements/WEB/WebPhoneInput/editor';
import { WebEmailInputEditor } from '../elements/WEB/WebEmailInput/editor';
import { WebButtonsInputEditor } from '../elements/WEB/WebButtonsInput/editor';
import { WebLogicRemoveMessagesEditor } from '../elements/WEB/WebLogicRemoveMessage';
import { WebInputCardsEditor } from '../elements/WEB/WebInputCards/editor';
import { WebContentMediaEditor } from '../elements/WEB/WebContentMedia';
import { WebOpinionScaleEditor } from '../elements/WEB/WebOpinionScale';
import { WebRatingEditor } from '../elements/WEB/WebRating/editor/WebRatingEditor';



interface Props {
    element: UIElement;
}

export const ElementMenu = ({ element }: Props) => {
    const confirm = useConfirm();
    const { openDialog, closeDialog } = useAppDialog();
    const { updateBlock, blocks, links, removeLinks } = useFlowDesignerStore((state) => ({
        blocks: state.project.blocks,
        updateBlock: state.updateBlock,
        links: state.project.links,
        removeLinks: state.removeLinks
    }));

    const block = useMemo(() => {
        const block = blocks.find(b => b.elements.includes(element));
        if (isNil(block)) {
            throw new Error('InvalidOperationError');
        }
        return block;
    }, [blocks, element]);

    const handleRemoveElement = useCallback(() => {
        void confirm({ description: "This will permanently delete the element.", title: 'Are you sure?' })
            .then(() => {
                const outputLinks = links.filter(l => (l.output as OutputPortDescription).elementId === element.id);

                if (outputLinks.length > 0) {
                    removeLinks(outputLinks);
                }

                remove(block.elements, e => e === element);
                updateBlock(block);
            });


    }, [block, confirm, element, links, removeLinks, updateBlock]);

    const getEditor = useCallback((elementArg: UIElement) => {

        switch (element.type) {
            case ElementType.CONTENT_TEXT: {
                const initialElement = elementArg as ContentTextUIElement;
                const newElement: ContentTextUIElement = {
                    ...initialElement
                };

                return { content: (<TextContentEditor element={newElement} />), title: 'Message Editor', newElement };
            }
            case ElementType.INPUT_BUTTONS: {
                const initialElement = elementArg as InputButtonsUIElement;
                const newElement: InputButtonsUIElement = {
                    ...initialElement,
                    buttons: initialElement.buttons?.map(b => ({ ...b })) ?? []
                };

                return { content: (<ButtonsEditor element={newElement} />), title: 'Buttons Editor', newElement };
            }
            case ElementType.INPUT_TEXT: {
                const initialElement = elementArg as InputTextUIElement;
                const newElement: InputTextUIElement = {
                    ...initialElement
                };

                return { content: (<TextInputEditor element={newElement} />), title: 'Text Input Editor', newElement };

            }
            case ElementType.LOGIC_CHANGE_VARIABLE: {
                const initialElement = elementArg as ChangeVariableUIElement;
                const newElement: ChangeVariableUIElement = {
                    ...initialElement
                };

                return { content: (<ChangeVariableEditor element={newElement} />), title: 'Change variable value', newElement };

            }
            case ElementType.LOGIC_CONDITION:
                {
                    const initialElement = elementArg as ConditionUIElement;
                    const newElement: ConditionUIElement = JSON.parse(JSON.stringify(initialElement));

                    return { content: (<ConditionEditor element={newElement} />), title: 'Configure condition', newElement };

                }
            case ElementType.LOGIC_EDIT_MESSAGE: {
                const initialElement = elementArg as EditMessageUIElement;
                const newElement: EditMessageUIElement = JSON.parse(JSON.stringify(initialElement));

                return { content: (<EditMessageEditor element={newElement} />), title: 'Edit message', newElement };
            }
            case ElementType.LOGIC_REMOVE_MESSAGE: {
                const initialElement = elementArg as RemoveMessageUIElement;
                const newElement: RemoveMessageUIElement = JSON.parse(JSON.stringify(initialElement));

                return { content: (<RemoveMessageEditor element={newElement} />), title: 'Remove message', newElement };
            }
            case ElementType.INTEGRATION_SEND_TELEGRAM_MESSAGE: {
                const initialElement = elementArg as SendTelegramMessageIntegrationUIElement;
                const newElement: SendTelegramMessageIntegrationUIElement = JSON.parse(JSON.stringify(initialElement));

                return { content: (<IntegrationSendTelegramMessageEditor element={newElement} />), title: 'Send message to telegram channel or group', newElement };
            }
            case ElementType.INTEGRATION_GOOGLE_SHEETS: {
                const initialElement = elementArg as GoogleSheetsIntegrationUIElement;
                const newElement: GoogleSheetsIntegrationUIElement = JSON.parse(JSON.stringify(initialElement));

                return { content: (<IntegrationGoogleSheetsEditor element={newElement} />), title: 'Google spreadsheets', newElement };
            }
            case ElementType.INTEGRATION_HTTP_REQUEST: {
                const initialElement = elementArg as HTTPRequestIntegrationUIElement;
                const newElement: HTTPRequestIntegrationUIElement = JSON.parse(JSON.stringify(initialElement));

                return { content: (<IntegrationHttpRequestEditor element={newElement} />), title: 'HTTP Request', newElement };
            }
            case ElementType.WEB_CONTENT_MESSAGE: {
                const initialElement = elementArg as WebContentTextUIElement;
                const newElement: WebContentTextUIElement = JSON.parse(JSON.stringify(initialElement));

                return { content: (<WebMessageEditor element={newElement} />), title: 'Edit message', newElement };
            }
            case ElementType.WEB_INPUT_TEXT: {
                const initialElement = elementArg as WebInputTextUIElement;
                const newElement: WebInputTextUIElement = {
                    ...initialElement
                };

                return { content: (<WebTextInputEditor element={newElement} />), title: 'Text Input Editor', newElement };

            }
            case ElementType.WEB_INPUT_NUMBER: {
                const initialElement = elementArg as WebInputNumberUIElement;
                const newElement: WebInputNumberUIElement = {
                    ...initialElement
                };

                return { content: (<WebNumberInputEditor element={newElement} />), title: 'Number Input Editor', newElement };

            }
            case ElementType.WEB_INPUT_DATE_TIME: {
                const initialElement = elementArg as WebInputDateTimeUIElement;
                const newElement: WebInputDateTimeUIElement = {
                    ...initialElement
                };

                return { content: (<WebDateTimeInputEditor element={newElement} />), title: 'Date Time Input Editor', newElement };
            }
            case ElementType.WEB_INPUT_PHONE: {
                const initialElement = elementArg as WebInputPhoneUIElement;
                const newElement: WebInputPhoneUIElement = {
                    ...initialElement
                };

                return { content: (<WebPhoneInputEditor element={newElement} />), title: 'Phone Input Editor', newElement };
            }
            case ElementType.WEB_INPUT_EMAIL: {
                const initialElement = elementArg as WebInputEmailUIElement;
                const newElement: WebInputEmailUIElement = {
                    ...initialElement
                };

                return { content: (<WebEmailInputEditor element={newElement} />), title: 'Email Input Editor', newElement };
            }
            case ElementType.WEB_INPUT_BUTTONS: {
                const initialElement = elementArg as WebInputButtonsUIElement;
                const newElement: WebInputButtonsUIElement = {
                    ...initialElement
                };

                return { content: (<WebButtonsInputEditor element={newElement} />), title: 'Buttons Input Editor', newElement };
            }
            case ElementType.WEB_LOGIC_REMOVE_MESSAGES:
                {
                    const initialElement = elementArg as WebLogicRemoveMessagesUIElement;
                    const newElement: WebLogicRemoveMessagesUIElement = {
                        ...initialElement
                    };

                    return { content: (<WebLogicRemoveMessagesEditor element={newElement} />), title: 'Remove messages', newElement };
                }

            case ElementType.WEB_INPUT_CARDS: {
                const initialElement = elementArg as WebInputCardsUIElement;
                const newElement: WebInputCardsUIElement = JSON.parse(JSON.stringify(initialElement));

                return { content: (<WebInputCardsEditor element={newElement} />), title: 'Cards Input Editor', newElement, dialogMaxWidth: "lg" as Breakpoint };
            }
            case ElementType.WEB_CONTENT_IMAGES:{
                const initialElement = elementArg as WebContentMediaUIElement;
                const newElement: WebContentMediaUIElement = JSON.parse(JSON.stringify(initialElement));
                return { content: (<WebContentMediaEditor mediaType={WebMediaType.IMAGE} element={newElement} />), title: 'Image(s) Editor', newElement, dialogMaxWidth: "md" as Breakpoint };
            }
            case ElementType.WEB_CONTENT_VIDEOS:{
                const initialElement = elementArg as WebContentMediaUIElement;
                const newElement: WebContentMediaUIElement = JSON.parse(JSON.stringify(initialElement));
                return { content: (<WebContentMediaEditor mediaType={WebMediaType.VIDEO} element={newElement} />), title: 'Video(s) Editor', newElement, dialogMaxWidth: "md" as Breakpoint };
            }
            case ElementType.WEB_OPINION_SCALE:{
                const initialElement = elementArg as WebOpinionScaleUIElement;
                const newElement: WebOpinionScaleUIElement = JSON.parse(JSON.stringify(initialElement));
                return { content: (<WebOpinionScaleEditor element={newElement} />), title: 'Opinion Scale Editor', newElement, dialogMaxWidth: "md" as Breakpoint };
            }
            case ElementType.WEB_RATING:{
                const initialElement = elementArg as WebRatingUIElement;
                const newElement: WebRatingUIElement = JSON.parse(JSON.stringify(initialElement));
                return { content: (<WebRatingEditor element={newElement} />), title: 'Rating Editor', newElement };
            }
            default: {
                throw new Error('NotImplementedError');
            }
        }

    }, [element.type]);

    const handleEditorClose = useCallback(() => {
        closeDialog();
    }, [closeDialog]);

    const handleEditorSave = useCallback((newElement: UIElement) => {

        const index = block.elements.findIndex(e => e.id === newElement.id);
        block.elements[index] = newElement;
        updateBlock(block);
    }, [block, updateBlock]);

    const handleEditElement = useCallback(() => {
        const { content, title, newElement, dialogMaxWidth = "sm" } = getEditor(element);

        openDialog({
            content,
            title,
            dialogMaxWidth,
            buttons: [
                <Button key={'save'} onClick={() => handleEditorSave(newElement)} variant='contained' color='success'>Save</Button>,
                <Button key={'close'} onClick={handleEditorClose}>Close</Button>
            ]
        });

    }, [element, getEditor, handleEditorClose, handleEditorSave, openDialog]);



    return (
        <>
            <Box sx={{
                display: 'flex',
                backgroundColor: Colors.WHITE,
                borderRadius: 1,
                border: `1px solid ${Colors.BORDER}`, padding: 0.5,
                marginLeft: block.elements.length === 1 ? '23px' : undefined
            }}>
                <IconButton size='small' aria-label="edit" onClick={handleEditElement}>
                    <EditIcon />
                </IconButton>
                {block.elements.length > 1 && (
                    <IconButton size='small' aria-label="delete" onClick={handleRemoveElement}>
                        <DeleteIcon />
                    </IconButton>
                )
                }
            </Box>
        </>
    )
}
