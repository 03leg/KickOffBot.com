import {
  BotVariable,
  ButtonElement,
  ConditionItem,
  ElementType,
  FileDescription,
  InputButtonsUIElement,
  LogicalOperator,
  MessageDescription,
  TimeDurationUnit,
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

export enum WebMediaType {
  IMAGE = "image",
  VIDEO = "video",
}

export interface WebMediaDescription {
  id: string;
  type: WebMediaType;
}

export enum VideoSource {
  YOUTUBE = "youtube",
  TIKTOK = "tiktok",
  UPLOADED = "uploaded",
  DIRECT_VIDEO_URL = "directVideoUrl",
}

export interface VideoDataSource {
  source: VideoSource;
  url: string;
}

export type WebImageDescription = string | UnsplashPhoto;
export type WebVideoDescription = VideoDataSource;

export interface WebImageMediaDescription extends WebMediaDescription {
  image: WebImageDescription;
  isLink?: boolean;
  imageLink?: string;

  imageWidth?: string;
  imageHeight?: string;
  maxImageWidth?: string;
  maxImageHeight?: string;
}

export interface WebVideoMediaDescription extends WebMediaDescription {
  video: WebVideoDescription;

  showVideoControls?: boolean;
  autoPlay?: boolean;
  videoWidth?: string;
  videoHeight?: string;

  startTime?: number;
  endTime?: number;

  loop?: boolean;
}

export enum MediaViewMode {
  HorizontalMediaList = "horizontalMediaList",
  VerticalMediaList = "verticalMediaList",
  WrappedHorizontalMediaList = "wrappedHorizontalMediaList",
  MasonryMediaList = "masonryMediaList",
}

export interface WebContentMediaUIElement extends UIElement {
  medias: WebMediaDescription[];
  viewMode: MediaViewMode;
}

export interface WebInputTextUIElement extends UIElement {
  label: string;
  variableId?: string;
  placeholder?: string;
  multiline?: boolean;
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

  disabledDatesVariableId?: BotVariable["id"];
  disabledTimesVariableId?: BotVariable["id"];
  disabledDateAndTimesVariableId?: BotVariable["id"];

  disableDaysOfWeek: boolean;
  disabledDaysOfWeek?: number[];

  maxDate?: string;
  minDate?: string;

  parkTimeVariableId?: BotVariable["id"];
  parkTimeType: TimeDurationUnit;
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

export enum WebRatingView {
  Star = "star",
  Heart = "heart",
  Smile = "smile",
}

export interface WebRatingUIElement extends UIElement {
  variableId?: string;
  elementCount: number;
  defaultAnswer?: number;
  showLabels: boolean;
  eachOptionLabel?: Record<number, string>;
  precision: number;
  view: WebRatingView;
}

export enum DataSourceType {
  Static = "static",
  Dynamic = "dynamic",
}

export interface WebLogicBrowserCodeUIElement extends UIElement {
  code: string;
  requiredVariableIds: string[];
  modifiedVariableIds: string[];
}

export interface WebMultipleChoiceUIElement extends UIElement {
  variableId?: string;

  dataSourceType: DataSourceType;

  // static
  optionsText?: string;
  defaultOptions?: string[];

  //dynamic
  dataSourceVariableId?: BotVariable["id"];
  optionValue?: string;
  optionTitle?: string;

  defaultOptionsVariableId?: BotVariable["id"];

  shuffleOptions: boolean;
}

export enum ChatItemTypeWebRuntime {
  BOT_MESSAGE = "bot-message",
  BOT_REQUEST = "bot-request",
  USER_MESSAGE = "user-message",
  SYSTEM_MESSAGE = "system-message",
  DELETE_MESSAGES = "delete-messages",
  CLIENT_CODE = "client-code",
}

export interface MessageDescriptionWebRuntime {
  message?: string;
  attachments?: FileDescription[];
}

export interface UserResponseDescriptionWebRuntime {
  message?: string;
  data: unknown;
}

export interface CodeResultDescription {
  updatedVariables: Record<BotVariable["name"], unknown>;
}

export interface RequestDescriptionWebRuntime {
  element: RequestElementBase;
  onResponse?: (response: UserResponseDescriptionWebRuntime) => void;
}

export interface DeleteMessagesDescriptionWebRuntime {
  deleteAllMessages?: boolean;
  elementIds?: string[];
}

export interface ClientCodeDescriptionRuntime {
  code: string;

  requestedVariables: Record<BotVariable["name"], unknown>;
}

export enum BotMessageBodyType {
  MessageAndAttachments = "message-and-attachments",
  Cards = "cards",
  Media = "media",
}

export interface MediaMessageDescription {
  medias: WebMediaDescription[];
  viewMode: MediaViewMode;
}

export interface BotMessageBody {
  type: BotMessageBodyType;
  content: MessageDescriptionWebRuntime | CardsViewerElement | MediaMessageDescription;
}

export interface ChatItemWebRuntime {
  id: string;
  itemType: ChatItemTypeWebRuntime;
  content: BotMessageBody | RequestDescriptionWebRuntime | DeleteMessagesDescriptionWebRuntime | ClientCodeDescriptionRuntime;
  uiElementId: UIElement["id"];
}

export interface RequestElementBase {
  elementType: ElementType;
}

export interface TextRequestElement extends RequestElementBase {
  placeholder?: string;
  multiline?: boolean;
}

export interface OpinionScaleRequestElement extends RequestElementBase {
  min: number;
  max: number;

  defaultAnswer?: number;

  showLabels: boolean;
  showLabelsMode: OpinionScaleShowLabelsMode;

  minLabel?: string;
  maxLabel?: string;

  eachOptionLabel?: Record<number, string>;
}

export interface RatingRequestElement extends RequestElementBase {
  elementCount: number;

  defaultAnswer?: number;

  showLabels: boolean;
  eachOptionLabel?: Record<number, string>;

  precision: number;
  view: WebRatingView;
}

export interface MultipleChoiceOptionDescription {
  title: string;
  value: string;
  autoId: string;
}

export interface MultipleChoiceRequestElement extends RequestElementBase {
  options: MultipleChoiceOptionDescription[];
  selectedOptions?: string[];
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

  disabledDates?: string[];
  disabledTimes?: string[];
  disabledDateAndTimes?: string[];
  maxDate?: string;
  minDate?: string;

  parkTime?: number;
  parkTimeType?: TimeDurationUnit;

  disableDaysOfWeek: boolean;
  disabledDaysOfWeek?: number[];
}

export interface WebCardChatItem {
  id: string;
  value?: string;
  image?: string | UnsplashPhoto;
  htmlDescription?: string;
  cardButtons?: ButtonElement[];
}

export interface CardsRequestElement extends RequestElementBase {
  selectableCards: boolean;
  multipleChoice: boolean;
  sendResponseOnSelect?: boolean;
  sendButtonText?: string;
  useCardButtons?: boolean;

  cardItems: WebCardChatItem[];

  useGeneralButtons?: boolean;
  generalButtons?: ButtonElement[];
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
  image?: string | UnsplashPhoto;
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
  cardButtons?: ButtonElement[];
  variableId?: BotVariable["id"];

  useGeneralButtons?: boolean;
  generalButtons?: ButtonElement[];
}

export enum OpinionScaleShowLabelsMode {
  MaxAndMin = "max-and-min",
  EachOption = "each-option",
}

export interface WebOpinionScaleUIElement extends UIElement {
  min: number;
  max: number;
  defaultAnswer?: number;

  showLabels: boolean;

  showLabelsMode: OpinionScaleShowLabelsMode;

  minLabel?: string;
  maxLabel?: string;

  eachOptionLabel?: Record<number, string>;

  variableId?: BotVariable["id"];
}

export interface CardsUserResponse {
  selectedCards: Pick<WebCardChatItem, "id" | "value">[];
  clickedCardButton?: ButtonElement;
  clickedGeneralButton?: ButtonElement;
  actionName?: string;
}

export interface ExportedImage {
  source: "unsplash";
}

export interface UnsplashPhoto extends ExportedImage {
  regularSrc: string;
  smallSrc: string;
  thumbSrc: string;
  id: string;
  authorName: string;
  authorNickname: string;
  appName: string;
}
