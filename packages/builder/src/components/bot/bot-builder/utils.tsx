import { type ContentTextUIElement, ElementType, type InputTextUIElement, type FlowDesignerUIBlockDescription, type UIElement, type InputButtonsUIElement, type FlowDesignerLink, type ButtonPortDescription, type BotVariable, BlockType, TransformDescription, ChangeVariableUIElement, ConditionUIElement, LogicalOperator, ButtonsSourceStrategy, CommandsUIElement, EditMessageUIElement, RemoveMessageUIElement, VariableConverter, SendTelegramMessageIntegrationUIElement, GoogleSheetsIntegrationUIElement, HTTPRequestIntegrationUIElement, HTTPMethod, VariableType, BotProject, BotPlatform, WebStartCommandsUIElement, WebContentTextUIElement, WebInputTextUIElement, WebInputNumberUIElement, WebInputDateTimeUIElement, AvailableDateTimes, WebInputPhoneUIElement, WebInputEmailUIElement, WebInputButtonsUIElement, WebLogicRemoveMessagesUIElement } from "@kickoffbot.com/types";
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
import TelegramIcon from '@mui/icons-material/Telegram';
import GoogleIcon from '@mui/icons-material/Google';
import HttpIcon from '@mui/icons-material/Http';
import NumbersIcon from '@mui/icons-material/Numbers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PhoneIcon from '@mui/icons-material/Phone';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import SmartButtonIcon from '@mui/icons-material/SmartButton';

export const TELEGRAM_DEFAULT_PROJECT_STATE: BotProject = {
    blocks: [...getTelegramDefaultBlocks()],
    links: [],
    variables: [
        {
            id: "user_id",
            type: VariableType.NUMBER,
            name: "user_id",
            value: -1,
            isPlatformVariable: true,
        },
        {
            id: "user_first_name",
            type: VariableType.STRING,
            name: "user_first_name",
            value: "",
            isPlatformVariable: true,
        },
        {
            id: "user_last_name",
            type: VariableType.STRING,
            name: "user_last_name",
            value: "",
            isPlatformVariable: true,
        },
        {
            id: "username",
            type: VariableType.STRING,
            name: "username",
            value: "",
            isPlatformVariable: true,
        },
        {
            id: "user_language_code",
            type: VariableType.STRING,
            name: "user_language_code",
            value: "",
            isPlatformVariable: true,
        },
        {
            id: "is_premium",
            type: VariableType.BOOLEAN,
            name: "is_premium",
            value: false,
            isPlatformVariable: true,
        },
    ],
    transformDescription: { scale: 1, x: 0, y: 0 },
    templates: [],
    connections: [],
};

const WEB_DEFAULT_PROJECT_STATE: BotProject = {
    blocks: [...getWebDefaultBlocks()],
    links: [],
    variables: [
    ],
    transformDescription: { scale: 1, x: 0, y: 0 },
    templates: [],
    connections: [],
};

export function getDefaultProjectState(platform: BotPlatform) {
    if (platform === BotPlatform.Telegram) {
        return TELEGRAM_DEFAULT_PROJECT_STATE;
    }

    if (platform === BotPlatform.WEB) {
        return WEB_DEFAULT_PROJECT_STATE;
    }

    throw new Error('InvalidOperationError');
}


export function getTelegramContentElements() {
    return [
        { type: ElementType.CONTENT_TEXT, title: 'Message', icon: <MessageIcon /> },
    ]
}

export function getWebContentElements() {
    return [
        { type: ElementType.WEB_CONTENT_MESSAGE, title: 'Message', icon: <MessageIcon /> },
    ]
}

export function getInputElements() {
    return [
        { type: ElementType.INPUT_TEXT, title: 'Text', icon: <TextFieldsIcon /> },
    ];
}

export function getWebInputElements() {
    return [
        { type: ElementType.WEB_INPUT_TEXT, title: 'Text', icon: <TextFieldsIcon /> },
        { type: ElementType.WEB_INPUT_NUMBER, title: 'Number', icon: <NumbersIcon /> },
        { type: ElementType.WEB_INPUT_DATE_TIME, title: 'Date', icon: <CalendarMonthIcon /> },
        { type: ElementType.WEB_INPUT_PHONE, title: 'Phone', icon: <PhoneIcon /> },
        { type: ElementType.WEB_INPUT_EMAIL, title: 'E-mail', icon: <AlternateEmailIcon /> },
        { type: ElementType.WEB_INPUT_BUTTONS, title: 'Buttons', icon: <SmartButtonIcon /> },
    ];
}

export function getWebLogicElements() {
    return [
        { type: ElementType.LOGIC_CHANGE_VARIABLE, title: 'Change variable', icon: <EditNoteIcon /> },
        { type: ElementType.LOGIC_CONDITION, title: 'Condition', icon: <ForkLeftIcon /> },
        { type: ElementType.WEB_LOGIC_REMOVE_MESSAGES, title: 'Remove messages', icon: <DeleteIcon /> },
        // { type: ElementType.LOGIC_EDIT_MESSAGE, title: 'Edit message', icon: <EditIcon /> },
        // { type: ElementType.LOGIC_REMOVE_MESSAGE, title: 'Remove message', icon: <DeleteIcon /> },
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

export function getIntegrationsElements() {
    return [
        { type: ElementType.INTEGRATION_SEND_TELEGRAM_MESSAGE, title: 'Send message to telegram channel or group', icon: <TelegramIcon />, size: 12 },
        { type: ElementType.INTEGRATION_GOOGLE_SHEETS, title: 'Google spreadsheets', icon: <GoogleIcon />, size: 12 },
        { type: ElementType.INTEGRATION_HTTP_REQUEST, title: 'Send&Receive HTTP request', icon: <HttpIcon />, size: 12 },
    ];
}

export function getWebIntegrationsElements() {
    return [
        // { type: ElementType.INTEGRATION_SEND_TELEGRAM_MESSAGE, title: 'Send message to telegram channel or group', icon: <TelegramIcon />, size: 12 },
        { type: ElementType.INTEGRATION_GOOGLE_SHEETS, title: 'Google spreadsheets', icon: <GoogleIcon />, size: 12 },
        // { type: ElementType.INTEGRATION_HTTP_REQUEST, title: 'Send&Receive HTTP request', icon: <HttpIcon />, size: 12 },
    ];
}

export function getIconByType(type: ElementType) {
    const description = [...getInputElements(), ...getTelegramContentElements(), ...getLogicElements(), ...getIntegrationsElements(),
    ...getWebContentElements(), ...getWebInputElements(), ...getWebLogicElements()].find(d => d.type === type);

    if (isNil(description)) {
        throw new Error('Property "description" can not be null here');
    }

    return description.icon;
}

export function needToChangeId(id: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
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
        case ElementType.INTEGRATION_SEND_TELEGRAM_MESSAGE: {
            const result: SendTelegramMessageIntegrationUIElement = {
                id,
                type: ElementType.INTEGRATION_SEND_TELEGRAM_MESSAGE,
            };
            return result;
        }
        case ElementType.INTEGRATION_GOOGLE_SHEETS: {
            const result: GoogleSheetsIntegrationUIElement = {
                id,
                type: ElementType.INTEGRATION_GOOGLE_SHEETS,
            }

            return result;
        }
        case ElementType.INTEGRATION_HTTP_REQUEST: {
            const result: HTTPRequestIntegrationUIElement = {
                id,
                type: ElementType.INTEGRATION_HTTP_REQUEST,
                httpMethod: HTTPMethod.GET,
                url: '',
                customHeaders: [],
                requestBody: '',
                useRequestBody: false,
                saveResponseData: false
            }
            return result;
        }
        case ElementType.WEB_CONTENT_MESSAGE: {
            const result: WebContentTextUIElement = {
                id,
                type: ElementType.WEB_CONTENT_MESSAGE,
                attachments: [],
            };
            return result;
        }
        case ElementType.WEB_INPUT_TEXT: {
            const result: WebInputTextUIElement = {
                id,
                type: ElementType.WEB_INPUT_TEXT,
                label: 'User input (text)...',
                placeholder: 'Write your answer...'
            };
            return result;
        }
        case ElementType.WEB_INPUT_NUMBER: {
            const result: WebInputNumberUIElement = {
                id,
                type: ElementType.WEB_INPUT_NUMBER,
                label: 'User input (number)...',
                placeholder: 'Write your answer...'
            };
            return result;
        }
        case ElementType.WEB_INPUT_DATE_TIME: {
            const result: WebInputDateTimeUIElement = {
                id,
                type: ElementType.WEB_INPUT_DATE_TIME,
                availableDateTimes: AvailableDateTimes.All,
                dateTimeFormat: 'DD/MM/YYYY',
                useTime: false,
            };
            return result;
        }
        case ElementType.WEB_INPUT_PHONE: {
            const result: WebInputPhoneUIElement = {
                id,
                type: ElementType.WEB_INPUT_PHONE,
            };
            return result;
        }
        case ElementType.WEB_INPUT_EMAIL: {
            const result: WebInputEmailUIElement = {
                id,
                type: ElementType.WEB_INPUT_EMAIL,
                placeholder: 'Write your answer...'
            };
            return result;
        }
        case ElementType.WEB_INPUT_BUTTONS: {
            const result: WebInputButtonsUIElement = {
                id,
                type: ElementType.WEB_INPUT_BUTTONS,
                strategy: ButtonsSourceStrategy.Manual,
                buttons: []
            };
            return result;
        }
        case ElementType.WEB_LOGIC_REMOVE_MESSAGES:{
            const result: WebLogicRemoveMessagesUIElement = {
                id,
                type: ElementType.WEB_LOGIC_REMOVE_MESSAGES
            }
            return result;
        }
        default: {
            throw Error('NotImplementedError');
        }
    }



}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
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

export function getTelegramDefaultBlocks() {
    return [
        {
            id: '/start',
            blockType: BlockType.COMMANDS,
            title: '/start',
            position: { x: 363, y: 175 },
            elements: [{
                type: ElementType.TELEGRAM_START_COMMANDS,
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

export function getWebDefaultBlocks() {
    return [
        {
            id: '/start',
            blockType: BlockType.COMMANDS,
            title: '/start',
            position: { x: 363, y: 175 },
            elements: [{
                type: ElementType.WEB_START_COMMANDS,
                commands: [
                    {
                        id: 'start',
                        title: 'Start the bot',
                        description: "Point where your bot will start",
                    }
                ],
            } as WebStartCommandsUIElement]
        }
    ];
}

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

export const getTextVariableReference = (variable: BotVariable, path?: string, converter?: VariableConverter): string => {
    if (isNil(path)) {
        return `<%variables.${variable.name}` + (converter ? `|${converter}` : '') + '%>';
    }

    return `<%variables.${variable.name}.${path}` + (converter ? `|${converter}` : '') + '%>'
}

export const getTextPropertyReference = (propertyName: string): string => {
    return `<%${propertyName}%>`;
}

export const getTemplateReference = (templateName: string): string => {
    return `<%templates.${templateName}%>`;
}

export const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));
