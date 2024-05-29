import { PositionDescription } from "./PositionDescription";
import { TransformDescription } from "./TransformDescription";

export enum ElementType {
  CONTENT_TEXT = "content-text",

  INPUT_TEXT = "input-text",
  INPUT_BUTTONS = "input-buttons",

  LOGIC_CHANGE_VARIABLE = "logic-change-variable",
  LOGIC_CONDITION = "logic-condition",
  LOGIC_EDIT_MESSAGE = "logic-edit-message",
  LOGIC_REMOVE_MESSAGE = "logic-remove-message",
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
  path?: string;
  operator?: ConditionOperator;
  value?: string | number | boolean;
  variableIdValue: string;
}

export interface PropertyConditionItem {
  id: string;
  propertyName: string;
  operator?: ConditionOperator;
  value?: string | number | boolean;
  variableIdValue: string;
  pathVariableIdValue?: string;
}

export interface ConditionUIElement extends UIElement {
  items: ConditionItem[];
  logicalOperator: LogicalOperator;
}

export enum EditMessageOperation {
  DELETE = "DELETE",
  EDIT = "EDIT",
}

export interface EditMessageUIElement extends UIElement {
  messageElementId?: string;
  editedMessage?: MessageContentDescription;
}

export interface ChangeVariableUIElement extends UIElement {
  selectedVariableId?: BotVariable["id"];
  restoreInitialValue?: boolean;
  workflowDescription?:
    | ChangeNumberStringVariableWorkflow
    | ChangeBooleanVariableWorkflow
    | ChangeObjectVariableWorkflow
    | ChangeArrayVariableWorkflow;
}

export enum ChangeBooleanVariableWorkflowStrategy {
  SET_TRUE,
  SET_FALSE,
  TOGGLE,
}

export enum ChangeObjectVariableDataSource {
  JSON,
  VARIABLE,
}

export enum ArrayFilterType {
  FIRST = "FIRST",
  LAST = "LAST",
  RANDOM_ITEM = "RANDOM_ITEM",
  CONDITIONS = "CONDITIONS",
}

export interface ArrayFilter {
  mode: ArrayFilterType;
  conditions?: PropertyConditionItem[];
  logicalOperator: LogicalOperator;
}

export interface VariableValueSource {
  variableId: BotVariable["id"];
  path?: string;
  arrayFilter?: ArrayFilter;
}

export interface ChangeObjectVariableWorkflow {
  source: ChangeObjectVariableDataSource;
  json?: string;
  variableSource?: VariableValueSource;
}

export enum ChangeArrayOperation {
  Add = "Add",
  Remove = "Remove",
  Set = "Set",
}

export enum AddValueToArraySource {
  JSON = "JSON",
  Variable = "Variable",
}

export interface ValuePathDescription {
  variableId: BotVariable["id"];
  path?: string;
}

// todo: rename to ArrayFilterDescription???
export interface AddValueToArrayFilterDescription {
  conditions?: PropertyConditionItem[];
  logicalOperator?: LogicalOperator;
}

export interface AddValueToArrayVariableSourceDescription {
  path: ValuePathDescription;
  extraFilter?: AddValueToArrayFilterDescription;
}

export interface AddValueToArrayDescription {
  source: AddValueToArraySource;
  variableSourceDescription?: AddValueToArrayVariableSourceDescription;
}

export type RemoveItemsFromArrayDescription = AddValueToArrayFilterDescription;

export interface ChangeArrayVariableWorkflow {
  operation: ChangeArrayOperation;
  addDescription?: AddValueToArrayDescription;
  setDescription?: AddValueToArrayDescription;
  removeDescription?: RemoveItemsFromArrayDescription;
}

export interface ChangeBooleanVariableWorkflow {
  strategy: ChangeBooleanVariableWorkflowStrategy;
}

export interface ChangeNumberStringVariableWorkflow {
  expression: string;
}

export interface MessageDescription{
  json?: string;
  htmlContent?: string;
  telegramContent?: string;
}

export interface MessageContentDescription extends MessageDescription {
  attachments: FileDescription[];
  showButtons: boolean;
  buttonsDescription: MessageButtonsDescription;
}

export interface ContentTextUIElement extends UIElement, MessageContentDescription {}

export interface InputTextUIElement extends UIElement {
  label: string;
  variableId: string | undefined;
}

export interface ButtonElement {
  id: string;
  content: string;
}

export enum ButtonsSourceStrategy {
  Manual = "manual",
  FromVariable = "fromVariable",
}

export interface VariableButtonsSourceStrategyDescription {
  variableSource?: VariableValueSource;
  answerVariableId?: string | undefined;
  propertyName?: string;
  customTextTemplate?: string;
}

export interface MessageButtonsDescription {
  strategy: ButtonsSourceStrategy;
  buttons?: ButtonElement[];
  variableButtonsSource?: VariableButtonsSourceStrategyDescription;
}

export interface InputButtonsUIElement extends UIElement {
  strategy: ButtonsSourceStrategy;
  buttons?: ButtonElement[];
  variableButtonsSource?: VariableButtonsSourceStrategyDescription;
}

export interface CommandDescription {
  id: string;
  command: string;
  description: string;
}

export interface CommandsUIElement extends UIElement {
  commands: CommandDescription[];
  id: "botCommands";
}

export enum BlockType {
  ELEMENTS,
  START,
  COMMANDS,
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

// todo: rename to JsonType
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
  arrayItemType?: Omit<VariableType, VariableType.ARRAY>;
  value: unknown;
  isPlatformVariable: boolean;
}

export interface BotProject {
  transformDescription: TransformDescription;
  blocks: FlowDesignerUIBlockDescription[];
  links: FlowDesignerLink[];
  variables: BotVariable[];
  templates: BotTemplate[];
}

export interface RemoveMessageUIElement extends UIElement {
  messageElementId?: string;
}

export interface BotTemplate extends MessageDescription {
  id: string;
  name: string;
  contextVariableId?: BotVariable["id"];
}
