import { ContentTextUIElement, ElementType, InputTextUIElement, type FlowDesignerUIBlockDescription, type UIElement, InputButtonsUIElement } from "./types";
import MessageIcon from '@mui/icons-material/Message';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import { isNil } from "lodash";
import { type DraggableElementData } from "./ToolBox/types";
import { v4 } from "uuid";
import { type DragEndEvent } from "@dnd-kit/core";
import { throwIfNil } from "~/utils/guard";
import { type PositionDescription, type TransformDescription } from "./FlowDesigner/types";
import { APP_ELEMENT_ROLE } from "./constants";

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
        { type: ElementType.INPUT_BUTTONS, title: 'Buttons', icon: <SmartButtonIcon /> },
        // { type: ElementType.INPUT_NUMBER, title: 'Number', icon: <NumbersIcon /> },
        // { type: ElementType.INPUT_EMAIL, title: 'Email', icon: <AlternateEmailIcon /> },
        // { type: ElementType.INPUT_DATE, title: 'Date', icon: <DateRangeIcon /> },
        // { type: ElementType.INPUT_PHONE, title: 'Phone', icon: <LocalPhoneIcon /> },
    ];
}

export function getIconByType(type: ElementType) {
    const description = [...getInputElements(), ...getContentElements()].find(d => d.type === type);

    if (isNil(description)) {
        throw new Error('Property "description" can not be null here');
    }

    return description.icon;
}

export function needToChangeId(id: string): boolean {
    const values = Object.values(ElementType) as string[];

    return values.includes(id);
}

// const map = new Map<ElementType, unknown>(
//     [
//         [ElementType.CONTENT_TEXT, { text: 'Text...', type: ElementType.CONTENT_TEXT }],
//         [ElementType.INPUT_TEXT, { label: 'User input...', type: ElementType.INPUT_TEXT }],
//         [ElementType.INPUT_BUTTONS, { type: ElementType.INPUT_BUTTONS }],
//     ]
// );

export function getNewUIElementTemplate(id: string, data: DraggableElementData) {
    // if (map.has(data.type)) {
    //     const template = map.get(data.type);
    //     return template;
    // }

    switch (data.type) {
        case ElementType.CONTENT_TEXT: {
            const result: ContentTextUIElement = { id, text: 'Text...', type: ElementType.CONTENT_TEXT };
            return result;
        }
        case ElementType.INPUT_TEXT: {
            const result: InputTextUIElement = { id, label: 'User input...', type: ElementType.INPUT_TEXT, input: null };
            return result;
        }
        case ElementType.INPUT_BUTTONS: {
            const result: InputButtonsUIElement = {
                id, type: ElementType.INPUT_BUTTONS, buttons: [
                    { content: "Click me...", id: v4() },
                    { content: "Button #1", id: v4() },
                    { content: "Button #2", id: v4() }
                ]
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
    return { id: v4(), title, position: { x: position.x, y: position.y }, elements: [{ ...firstElement }] };
}