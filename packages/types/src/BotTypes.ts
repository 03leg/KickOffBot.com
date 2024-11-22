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

  INTEGRATION_SEND_TELEGRAM_MESSAGE = "integration-send-telegram-message",
  INTEGRATION_GOOGLE_SHEETS = "integration-google-sheets",
  INTEGRATION_HTTP_REQUEST = "integration-http-request",

  TELEGRAM_START_COMMANDS = "telegram-start-commands",

  WEB_START_COMMANDS = "web-start-commands",
  WEB_CONTENT_MESSAGE = "web-content-message",
  WEB_CONTENT_IMAGES = "web-content-images",
  WEB_CONTENT_VIDEOS = "web-content-videos",
  WEB_INPUT_TEXT = "web-input-text",
  WEB_INPUT_NUMBER = "web-input-number",
  WEB_INPUT_DATE_TIME = "web-input-date-time",
  WEB_INPUT_PHONE = "web-input-phone",
  WEB_INPUT_EMAIL = "web-input-email",
  WEB_INPUT_BUTTONS = "web-input-buttons",

  WEB_LOGIC_REMOVE_MESSAGES = "web-logic-remove-messages",
  WEB_INPUT_CARDS = "web-input-cards",
  WEB_OPINION_SCALE = "web-opinion-scale",
  WEB_RATING = "web-rating",

  WEB_MULTIPLE_CHOICE = "web-multiple-choice",

  WEB_LOGIC_BROWSER_CODE = "web-logic-browser-code",
}

export interface UIElement {
  type: ElementType;
  id: string;
}

export enum ContentType {
  Image,
  Other,
  Video,
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
    | ChangeDateTimeVariableWorkflow
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
  INSERT_PROPERTY,
  REMOVE_PROPERTY,
}

export enum ArrayFilterType {
  FIRST = "FIRST",
  LAST = "LAST",
  RANDOM_ITEM = "RANDOM_ITEM",
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

  // for insert or remove property
  propertyName?: string;
  // for insert property
  propertyValue?: unknown;
}

export enum ChangeArrayOperation {
  Add = "Add",
  Remove = "Remove",
  Set = "Set",
}

export enum AddValueToArraySource {
  JSON = "JSON",
  Variable = "Variable",
  Function = "Function",
}

export interface ValuePathDescription {
  variableId: BotVariable["id"];
  path?: string;
}

export interface ValueReference extends ValuePathDescription {}

// todo: rename to ArrayFilterDescription???
export interface AddValueToArrayFilterDescription {
  conditions?: PropertyConditionItem[];
  logicalOperator?: LogicalOperator;
}

export interface AddValueToArrayVariableSourceDescription {
  path: ValuePathDescription;
  extraFilter?: AddValueToArrayFilterDescription;
}

export enum ArrayItemsGenerator {
  TIME_SLOTS_GENERATOR = "TIME_SLOTS_GENERATOR",
}

export enum TimeDurationUnit {
  MINUTES = "MINUTES",
  HOURS = "HOURS",
  DAYS = "DAYS",
}

export interface TimeSlotsGeneratorDescription {
  startTimeRef?: ValueReference;
  endTimeRef?: ValueReference;
  slotDuration?: string;
  slotDurationUnit?: TimeDurationUnit;
}

export interface AddValueToArrayAutoGenerateDescription {
  functionName: ArrayItemsGenerator;
  description: TimeSlotsGeneratorDescription;
}

export interface AddValueToArrayDescription {
  source: AddValueToArraySource;
  variableSourceDescription?: AddValueToArrayVariableSourceDescription;
  functionSourceDescription?: AddValueToArrayAutoGenerateDescription;
}

export enum RemoveItemFromArrayMode {
  FIRST = "FIRST",
  LAST = "LAST",
  RANDOM = "RANDOM",
  ALL = "ALL",
}

export interface RemoveItemsFromArrayDescription extends AddValueToArrayFilterDescription {
  mode: RemoveItemFromArrayMode;
}

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

export enum ChangeDateTimeVariableOperation {
  SET_NEW_VALUE = "SET_NEW_VALUE",
  ADD_DURATION = "ADD_DURATION",
  REMOVE_DURATION = "REMOVE_DURATION",
}

export enum ChangeDateTimeDurationType {
  Mins = "mins",
  Hours = "hours",
  Days = "days",
}

export interface ChangeDateTimeVariableWorkflow {
  operation: ChangeDateTimeVariableOperation;

  newValue?: string;

  duration?: string;
  durationType?: ChangeDateTimeDurationType;
}

export interface MessageDescription {
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
  type: ElementType.TELEGRAM_START_COMMANDS;
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
  DATE_TIME = "date_time",
}

export interface BotVariable {
  id: string;
  name: string;
  type: VariableType;
  arrayItemType?: Omit<VariableType, VariableType.ARRAY>;
  value: unknown;
  isPlatformVariable: boolean;

  dateTimeFormat?: string; // only for date_time type
}

export interface BotProject {
  transformDescription: TransformDescription;
  blocks: FlowDesignerUIBlockDescription[];
  links: FlowDesignerLink[];
  variables: BotVariable[];
  templates: BotTemplate[];
  connections: ConnectionDescription[];
}

export interface RemoveMessageUIElement extends UIElement {
  messageElementId?: string;
}

export interface BotTemplate extends MessageDescription {
  id: string;
  name: string;
  contextVariableId?: BotVariable["id"];
  showContentWhenArrayIsEmpty: boolean;

  isPlainText?: boolean;

  emptyArrayJson?: string;
  emptyArrayHtmlContent?: string;
  emptyArrayTelegramContent?: string;
}

export enum VariableConverter {
  SUM = "sum",
  MIN = "min",
  MAX = "max",
  AVG = "avg",
  COUNT = "count",

  RANDOM = "random",
  CONCAT = "concat",

  FORMAT = "format",
}

export interface SendTelegramMessageIntegrationUIElement extends UIElement, MessageDescription {
  connectionId?: TelegramConnectionDescription["id"];
}

export enum ConnectionType {
  Telegram,
  Google,
}

export interface ConnectionDescription {
  type: ConnectionType;
  id: string;
  name: string;
}

export interface TelegramConnectionDescription extends ConnectionDescription {
  botToken: string;
  targetChatId: string;
}

export interface GoogleSheetsConnectionDescription extends ConnectionDescription {
  email: string;
  accessToken: string;
  credentials?: unknown;
}
export interface SelectedGoogleSpreadSheet {
  name: string;
  id: string;
}
export interface GoogleSheetsIntegrationUIElement extends UIElement {
  connectionId?: GoogleSheetsConnectionDescription["id"];
  selectedSpreadSheet?: SelectedGoogleSpreadSheet;
  selectedSheet?: SheetDescription;

  dataOperation?: DataSpreedSheetOperation;

  dataOperationDescription?: ReadRowsToArrayDescription | InsertRowsFromVariableDescription | UpdateRowsFromObjectVariableDescription;
}

interface ReadRowsToArrayDescription {
  variableId: BotVariable["id"];
}

interface InsertRowsFromVariableDescription {
  variableId: BotVariable["id"];
}

export interface SpreadSheetRowsFilterConditionItem {
  id: string;
  header?: string;
  operator?: ConditionOperator;
  value?: string | number | boolean;

  variableIdValue?: string;
  pathVariableIdValue?: string;
}

export interface SpreadSheetRowsFilter {
  operator: LogicalOperator;
  conditions: SpreadSheetRowsFilterConditionItem[];
}

export interface UpdateRowsFromObjectVariableDescription {
  variableId: BotVariable["id"];
  filter?: SpreadSheetRowsFilter;
}

export interface SheetDescription {
  id: number;
  title: string;
  headerValues: string[];
}

export enum DataSpreedSheetOperation {
  READ_ROWS_TO_ARRAY = "READ_ROWS_TO_ARRAY",
  INSERT_ROWS_FROM_VARIABLE = "INSERT_ROWS_FROM_VARIABLE",
  UPDATE_ROWS_FROM_OBJECT_VARIABLE = "UPDATE_ROWS_FROM_OBJECT_VARIABLE",
}

export enum HTTPMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}
export interface HttpHeader {
  header: string;
  value: string;
}
export interface HTTPRequestIntegrationUIElement extends UIElement {
  httpMethod: HTTPMethod;
  url: string;
  customHeaders: HttpHeader[];
  useRequestBody: boolean;
  requestBody: string;
  saveResponseData: boolean;
  responseDataVariableId?: BotVariable["id"];
}

export enum BotPlatform {
  Telegram = 0,
  WEB = 1,
}
