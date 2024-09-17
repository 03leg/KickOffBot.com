import {
  BotVariable,
  ButtonElement,
  ConditionItem,
  ElementType,
  FileDescription,
  InputButtonsUIElement,
  LogicalOperator,
  MessageDescription,
  UIElement,
} from "./BotTypes";

export interface WebStartCommand {
  id: string;
  title: string;
  description?: string;
}

export interface WebStartCommandsUIElement extends UIElement {
  id: "webStartCommands";
  type: ElementType.WEB_START_COMMANDS;
  commands: WebStartCommand[];
}

export interface WebContentTextUIElement extends UIElement, MessageDescription {
  attachments: FileDescription[];
}

export interface WebInputTextUIElement extends UIElement {
  label: string;
  variableId?: string;
  placeholder?: string;
}

export interface WebInputNumberUIElement extends UIElement {
  label: string;
  variableId?: string;
  placeholder?: string;
  max?: number;
  min?: number;
  step?: number;
}

export interface WebInputDateTimeUIElement extends UIElement {
  variableId?: string;
  dateTimeFormat?: string;
  availableDateTimes: AvailableDateTimes;

  availableDateTimesVariableId?: BotVariable["id"];
  useTime: boolean;

  useAmPm?: boolean;
  maxTime?: string;
  minTime?: string;
  minutesStep?: number;
}

export interface WebInputPhoneUIElement extends UIElement {
  value?: string;
  variableId?: string;
  defaultCountry?: string;
}

export interface WebInputButtonsUIElement extends InputButtonsUIElement {}

export interface WebInputEmailUIElement extends UIElement {
  variableId?: string;
  placeholder?: string;
}

export enum AvailableDateTimes {
  All = "All",
  PastDatesAndToday = "PastDatesAndToday",
  FutureDatesAndToday = "FutureDatesAndToday",
  PastDates = "PastDates",
  FutureDates = "FutureDates",
  DatesFromVariable = "DatesFromVariable",
}

export interface WebLogicRemoveMessagesUIElement extends UIElement {
  removeAllMessages?: boolean;
  messageIds?: string[];
}

export enum ChatItemTypeWebRuntime {
  BOT_MESSAGE = "bot-message",
  BOT_REQUEST = "bot-request",
  USER_MESSAGE = "user-message",
  SYSTEM_MESSAGE = "system-message",
  DELETE_MESSAGES = "delete-messages",
}

export interface MessageDescriptionWebRuntime {
  message?: string;
  attachments?: FileDescription[];
}

export interface UserResponseDescriptionWebRuntime {
  data: unknown;
}

export interface RequestDescriptionWebRuntime {
  element: RequestElementBase;
  onResponse?: (response: UserResponseDescriptionWebRuntime) => void;
}

export interface DeleteMessagesDescriptionWebRuntime {
  deleteAllMessages?: boolean;
  elementIds?: string[];
}

export enum BotMessageBodyType {
  MessageAndAttachments = "message-and-attachments",
  Cards = "cards",
}

export interface BotMessageBody {
  type: BotMessageBodyType;
  content: MessageDescriptionWebRuntime | CardsViewerElement;
}

export interface ChatItemWebRuntime {
  id: string;
  itemType: ChatItemTypeWebRuntime;
  content: BotMessageBody | RequestDescriptionWebRuntime | DeleteMessagesDescriptionWebRuntime;
  uiElementId: UIElement["id"];
}

export interface RequestElementBase {
  elementType: ElementType;
}

export interface TextRequestElement extends RequestElementBase {
  placeholder?: string;
}

export interface NumberRequestElement extends RequestElementBase {
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface DateTimeRequestElement extends RequestElementBase {
  dateTimeFormat?: string;
  availableDateTimes: AvailableDateTimes;
  useTime: boolean;
  useAmPm?: boolean;
  maxTime?: string;
  minTime?: string;
  minutesStep?: number;
  variableAvailableDateTimes?: string[];
}

export interface WebCardChatItem {
  id: string;
  value?: string;
  imgUrl?: string;
  htmlDescription?: string;
}

export interface CardsRequestElement extends RequestElementBase {
  selectableCards: boolean;
  multipleChoice: boolean;
  sendResponseOnSelect?: boolean;
  sendButtonText?: string;
  useCardButtons?: boolean;
  showSendButton?: boolean;
  cardButtons?: ButtonElement[];
  cardItems: WebCardChatItem[];
}

export interface CardsViewerElement extends Pick<CardsRequestElement, "cardItems"> {}

export interface PhoneRequestElement extends RequestElementBase {
  defaultCountry?: string;
}

export interface EmailRequestElement extends RequestElementBase {
  placeholder?: string;
}

export interface RequestButtonDescription {
  id: string;
  content: string;
}

export interface ButtonsRequestElement extends RequestElementBase {
  buttons: RequestButtonDescription[];
}

export enum WebCardsSourceStrategy {
  Static,
  Dynamic,
}

export interface CardVisibilityCondition {
  items: ConditionItem[];
  logicalOperator: LogicalOperator;
}

export interface WebCardDescriptionClassic {
  id: string;
  imgUrl?: string;
  title?: string;
  htmlDescription?: string;
  jsonDescription?: string;

  useVisibilityConditions?: boolean;
  visibilityConditionsDescription?: CardVisibilityCondition;
}

export interface WebCardTemplateDescriptionClassic {
  imgUrl?: string;
  value?: string;
  htmlDescription?: string;
  jsonDescription?: string;
}

export interface StaticSourceDescription {
  cards: WebCardDescriptionClassic[];
}

export interface DynamicSourceDescription {
  cardsVariableId?: BotVariable["id"];
  cardDescription?: WebCardTemplateDescriptionClassic;
}

export interface WebInputCardsUIElement extends UIElement {
  selectableCards: boolean;
  multipleChoice: boolean;
  sendResponseOnSelect?: boolean;
  sendButtonText?: string;
  useCardButtons?: boolean;
  strategy: WebCardsSourceStrategy;
  sourceDescription?: StaticSourceDescription | DynamicSourceDescription;
  buttons?: ButtonElement[];
  variableId?: BotVariable["id"];
  showSendButton?: boolean;
}

export interface CardsUserResponse {
  selectedCards: Pick<WebCardChatItem, "id" | "value">[];
  clickedButton?: ButtonElement;
  actionName?: string;
}
