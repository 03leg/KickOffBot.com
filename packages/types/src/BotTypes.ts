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

  LOGIC_CHANGE_VARIABLE = "logic-change-variable",
  LOGIC_CONDITION = "logic-condition",
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

export enum ConditionOperator {
  //base
  EQUAL_TO = "EQUAL_TO",
  NOT_EQUAL_TO = "NOT_EQUAL_TO",
  // number
  GREATER_THAN = "GREATER_THAN",
  LESS_THAN = "LESS_THAN",
  // string
  CONTAINS = "CONTAINS",
  DOES_NOT_CONTAIN = "DOES_NOT_CONTAIN",
  IS_EMPTY = "IS_EMPTY",
  STARTS_WITH = "STARTS_WITH",
  END_WITH = "END_WITH",
  MATCHES_REGEX = "MATCHES_REGEX",
  DOES_NOT_MATCHES_REGEX = "DOES_NOT_MATCHES_REGEX",
}

export enum LogicalOperator {
  AND = "AND",
  OR = "OR",
}
export interface ConditionItem {
  id: string;
  variableId: BotVariable["id"];
  operator?: ConditionOperator;
  value?: string | number | boolean;
  variableIdValue: string;
}

export interface ConditionUIElement extends UIElement {
  items: ConditionItem[];
  logicalOperator: LogicalOperator;
}

export interface ChangeVariableUIElement extends UIElement {
  selectedVariableId?: BotVariable["id"];
  workflowDescription?:
    | ChangeNumberStringVariableWorkflow
    | ChangeBooleanVariableWorkflow;
}

export enum ChangeBooleanVariableWorkflowStrategy {
  SET_TRUE,
  SET_FALSE,
  TOGGLE,
}

export interface ChangeBooleanVariableWorkflow {
  strategy: ChangeBooleanVariableWorkflowStrategy;
}

export interface ChangeNumberStringVariableWorkflow {
  expression: string;
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

export enum PortType {
  BLOCK,
  ELEMENT,
  BUTTONS_ELEMENT,
}

export interface PortDescription {
  blockId: string;
  type: PortType;
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
