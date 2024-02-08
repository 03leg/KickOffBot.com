import { PositionDescription } from "./PositionDescription";
import { TransformDescription } from "./TransformDescription";

export enum ElementType {
  CONTENT_TEXT = "content-text",
  CONTENT_IMAGE = "content-image",
  CONTENT_AUDIO = "content-audio",
  CONTENT_VIDEO = "content-video",

  INPUT_TEXT = "input-text",
  INPUT_BUTTONS = "input-buttons",
  INPUT_NUMBER = "input-number",
  INPUT_EMAIL = "input-email",
  INPUT_DATE = "input-date",
  INPUT_PHONE = "input-phone",
}

export interface UIElement {
  type: ElementType;
  id: string;
}

export enum ContentType {
  Image,
  Other,
}

export interface FileDescription {
  name: string;
  url: string;
  typeContent: ContentType;
  size: number;
}

export interface ContentTextUIElement extends UIElement {
  json?: string;
  htmlContent?: string;
  telegramContent?: string;
  attachments: FileDescription[];
}

export interface InputTextUIElement extends UIElement {
  label: string;
  variableId: string | undefined;
}

export interface ButtonElement {
  id: string;
  content: string;
}

export interface InputButtonsUIElement extends UIElement {
  buttons: ButtonElement[];
}

export enum BlockType {
  ELEMENTS,
  START,
}

export interface FlowDesignerUIBlockDescription {
  id: string;
  title: string;
  position: PositionDescription;
  elements: UIElement[];
  blockType: BlockType;
}

export interface PortDescription {
  blockId: string;
}

export interface OutputPortDescription extends PortDescription {
  elementId: string;
}

export interface ButtonPortDescription extends OutputPortDescription {
  buttonId: string;
}

export interface FlowDesignerLink {
  id: string;
  output: PortDescription;
  input: PortDescription;
}

export enum VariableType {
  STRING = "string",
  NUMBER = "number",
  OBJECT = "object",
  ARRAY = "array",
  BOOLEAN = "boolean",
}

export interface BotVariable {
  id: string;
  name: string;
  type: VariableType;
  value: unknown;
}

export interface BotProject {
  transformDescription: TransformDescription;
  blocks: FlowDesignerUIBlockDescription[];
  links: FlowDesignerLink[];
  variables: BotVariable[];
}
