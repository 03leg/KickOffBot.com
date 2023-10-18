import { type PositionDescription } from "./FlowDesigner/types";

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

export interface ContentTextUIElement extends UIElement {
  text: string;
}

export interface InputTextUIElement extends UIElement {
  label: string;
  input: string | null;
}

export interface ButtonElement {
  id: string;
  content: string;
}

export interface InputButtonsUIElement extends UIElement {
  buttons: ButtonElement[];
}

export interface FlowDesignerUIBlockDescription {
  id: string;
  position: PositionDescription;
  elements: UIElement[];
}
