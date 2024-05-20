import { type ContentTextUIElement, ElementType, type InputTextUIElement, type FlowDesignerUIBlockDescription, type UIElement, type InputButtonsUIElement, type FlowDesignerLink, type ButtonPortDescription, type BotVariable, BlockType, TransformDescription, ChangeVariableUIElement, ConditionUIElement, LogicalOperator, ButtonsSourceStrategy, CommandsUIElement, EditMessageUIElement, EditMessageOperation, RemoveMessageUIElement } from "@kickoffbot.com/types";
import MessageIcon from '@mui/icons-material/Message';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { isNil } from "lodash";
import { type DraggableElementData } from "./ToolBox/types";
import { v4 } from "uuid";
import { type DragEndEvent } from "@dnd-kit/core";
import { throwIfNil } from "~/utils/guard";

import { APP_ELEMENT_ROLE } from "./constants";
import { PositionDescription } from "@kickoffbot.com/types";
import EditNoteIcon from '@mui/icons-material/EditNote';
import ForkLeftIcon from '@mui/icons-material/ForkLeft';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


export function getContentElements() {
    return [
        { type: ElementType.CONTENT_TEXT, title: 'Text', icon: <MessageIcon /> },
        // { type: ElementType.CONTENT_IMAGE, title: 'Image', icon: <ImageIcon /> },
        // { type: ElementType.CONTENT_AUDIO, title: 'Audio', icon: <AudiotrackIcon /> },
        // { type: ElementType.CONTENT_VIDEO, title: 'Video', icon: <VideocamIcon /> },
    ]
}

export function getInputElements() {
    return [
        { type: ElementType.INPUT_TEXT, title: 'Text', icon: <TextFieldsIcon /> },
        // { type: ElementType.INPUT_BUTTONS, title: 'Buttons', icon: <SmartButtonIcon /> },
        // { type: ElementType.INPUT_NUMBER, title: 'Number', icon: <NumbersIcon /> },
        // { type: ElementType.INPUT_EMAIL, title: 'Email', icon: <AlternateEmailIcon /> },
        // { type: ElementType.INPUT_DATE, title: 'Date', icon: <DateRangeIcon /> },
        // { type: ElementType.INPUT_PHONE, title: 'Phone', icon: <LocalPhoneIcon /> },
    ];
}

export function getLogicElements() {
    return [
        { type: ElementType.LOGIC_CHANGE_VARIABLE, title: 'Change variable', icon: <EditNoteIcon /> },
        { type: ElementType.LOGIC_CONDITION, title: 'Condition', icon: <ForkLeftIcon /> },
        { type: ElementType.LOGIC_EDIT_MESSAGE, title: 'Edit message', icon: <EditIcon /> },
        { type: ElementType.LOGIC_REMOVE_MESSAGE, title: 'Remove message', icon: <DeleteIcon /> },
    ];
}

export function getIconByType(type: ElementType) {
    const description = [...getInputElements(), ...getContentElements(), ...getLogicElements()].find(d => d.type === type);

    if (isNil(description)) {
        throw new Error('Property "description" can not be null here');
    }

    return description.icon;
}

export function needToChangeId(id: string): boolean {
    const values = Object.values(ElementType) as string[];

    return values.includes(id);
}

export function getNewUIElementTemplate(id: string, data: DraggableElementData): UIElement {
    switch (data.type) {
        case ElementType.CONTENT_TEXT: {
            const result: ContentTextUIElement = { 
                id, 
                type: ElementType.CONTENT_TEXT, 
                attachments: [],
                showButtons: false,
                buttonsDescription: { strategy: ButtonsSourceStrategy.Manual, buttons: [] }
             };
            return result;
        }
        case ElementType.INPUT_TEXT: {
            const result: InputTextUIElement = { id, label: 'User input...', type: ElementType.INPUT_TEXT, variableId: undefined };
            return result;
        }
        case ElementType.INPUT_BUTTONS: {
            const result: InputButtonsUIElement = {
                id,
                strategy: ButtonsSourceStrategy.Manual,
                type: ElementType.INPUT_BUTTONS,
                buttons: [
                    { content: "click me, plz...", id: v4() },
                ]
            };
            return result;
        }
        case ElementType.LOGIC_CHANGE_VARIABLE: {
            const result: ChangeVariableUIElement = {
                id,
                type: ElementType.LOGIC_CHANGE_VARIABLE,
                selectedVariableId: undefined,
                workflowDescription: undefined
            };

            return result;
        }
        case ElementType.LOGIC_CONDITION:
            {
                const result: ConditionUIElement = {
                    id,
                    type: ElementType.LOGIC_CONDITION,
                    logicalOperator: LogicalOperator.AND,
                    items: []
                };

                return result;
            }
        case ElementType.LOGIC_EDIT_MESSAGE: {
            const result: EditMessageUIElement = {
                id,
                type: ElementType.LOGIC_EDIT_MESSAGE,
            };
            return result;
        }
        case ElementType.LOGIC_REMOVE_MESSAGE: {
            const result: RemoveMessageUIElement = {
                id,
                type: ElementType.LOGIC_REMOVE_MESSAGE,
            };
            return result;
        }
        default: {
            throw Error('NotImplementedError');
        }
    }



}

export function getPositionForNewBlock(event: DragEndEvent, container: HTMLElement | null, viewportTransform: TransformDescription | null): PositionDescription | null {
    throwIfNil(container);
    throwIfNil(viewportTransform);

    const activatorEvent = event.activatorEvent as PointerEvent;
    const containerPosition = container.getBoundingClientRect();
    const delta = event.delta;

    const toolbox = document.querySelector(`div[data-app-role="${APP_ELEMENT_ROLE.toolBox}"]`);
    throwIfNil(toolbox);
    const toolboxPosition = toolbox.getBoundingClientRect();

    if (delta.x * viewportTransform.scale + activatorEvent.x < toolboxPosition.x + toolboxPosition.width) {
        // it's outside viewport
        return null;
    }

    const x = (activatorEvent.x - containerPosition.x - viewportTransform.x) * (1 / viewportTransform.scale) + delta.x;
    const y = (activatorEvent.y - containerPosition.y - viewportTransform.y) * (1 / viewportTransform.scale) + delta.y;

    return { x, y };
}

export function getNewBlock(position: PositionDescription, firstElement: UIElement, title: string): FlowDesignerUIBlockDescription {
    return { id: v4(), blockType: BlockType.ELEMENTS, title, position: { x: position.x, y: position.y }, elements: [{ ...firstElement }] };
}

export function getDefaultBlocks() {
    return [
        {
            id: '/start', blockType: BlockType.COMMANDS, title: '/start', position: { x: 363, y: 175 }, elements: [{
                commands: [
                    {
                        id: '/start',
                        command: '/start',
                        description: 'Start the bot',
                    }
                ],
            } as CommandsUIElement]
        }
    ];
}

// export const generateElements = () => {
//     const textUIElement1: ContentTextUIElement = {
//         type: ElementType.CONTENT_TEXT,
//         json: 'Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1',
//         id: '11111' + v4(),
//     };
//     const textUIElement2: ContentTextUIElement = {
//         type: ElementType.CONTENT_TEXT,
//         json: 'Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! ' + v4(),
//         id: '22222' + v4(),
//     };
//     const textUIElement3: ContentTextUIElement = {
//         type: ElementType.CONTENT_TEXT,
//         json: 'Privet3! Privet3! Privet3! ' + v4(),
//         id: '33333' + v4(),
//     };
//     const textUIElement4: ContentTextUIElement = {
//         type: ElementType.CONTENT_TEXT,
//         json: 'Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1',
//         id: '11111' + v4(),
//     };
//     const textUIElement5: ContentTextUIElement = {
//         type: ElementType.CONTENT_TEXT,
//         json: 'Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! ' + v4(),
//         id: '22222' + v4(),
//     };
//     const textUIElement6: ContentTextUIElement = {
//         type: ElementType.CONTENT_TEXT,
//         json: 'Privet3!' + v4(),
//         id: '33333' + v4(),
//     };
//     const textUIElement7: ContentTextUIElement = {
//         type: ElementType.CONTENT_TEXT,
//         json: 'Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1',
//         id: '11111' + v4(),
//     };
//     const textUIElement8: ContentTextUIElement = {
//         type: ElementType.CONTENT_TEXT,
//         json: 'Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! ' + v4(),
//         id: '22222' + v4(),
//     };
//     const textUIElement9: ContentTextUIElement = {
//         type: ElementType.CONTENT_TEXT,
//         json: 'Privet3! Privet3! Privet3! Privet3!  Privet3!  Privet3!  Privet3!  Privet3!' + v4(),
//         id: '33333' + v4(),
//     };
//     return [
//         textUIElement1,
//         textUIElement2,
//         textUIElement3,
//         textUIElement4,
//         textUIElement5,
//         textUIElement6,
//         textUIElement7,
//         textUIElement8,
//         textUIElement9,
//     ]
// };

export const canLink = (newLink: FlowDesignerLink, links: FlowDesignerLink[]) => {
    let result = true;

    if (newLink.input.blockId === newLink.output.blockId) {
        result = false;
    }

    const existLink = links.some(l => !isNil((l.output as ButtonPortDescription).buttonId)
        && (l.output as ButtonPortDescription).buttonId === (newLink.output as ButtonPortDescription).buttonId
        && l.input.blockId === newLink.input.blockId);

    if (existLink) {
        result = false;
    }

    return result;

};

export const getTextVariableReference = (variable: BotVariable, path?: string): string => {
    if (isNil(path)) {
        return `<%variables.${variable.name}%>`;
    }

    return `<%variables.${variable.name}.${path}%>`
}

export const getTextPropertyReference = (propertyName: string): string => {
    return `<%${propertyName}%>`;
}

