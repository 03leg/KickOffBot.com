import {
  type TransformDescription,
  type PositionDescription,
} from "./FlowDesigner/types";

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
  title: string;
  position: PositionDescription;
  elements: UIElement[];
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
  output: OutputPortDescription;
  input: PortDescription;
}

export interface BotProject {
  blocks: FlowDesignerUIBlockDescription[];
  links: FlowDesignerLink[];
}

export interface FlowDesignerState {
  scale: number;
  transformDescription: TransformDescription;
  changeTransformDescription: (newValue: TransformDescription) => void;
  showTemporaryLink: boolean;
  tempLinkPath: string | null;
  showTempLink: VoidFunction;
  hideTempLink: VoidFunction;
  setTempLinkPath: (value: string) => void;
  project: BotProject;
  updateBlock: (updatedBlock: FlowDesignerUIBlockDescription) => void;
  viewPortOffset: PositionDescription;
  setViewPortOffset: (value: PositionDescription) => void;
  addLink: (newLink: FlowDesignerLink) => void;

  addBlock: (newBlock: FlowDesignerUIBlockDescription) => void;
}
