import { BotVariable, ElementType, FileDescription, MessageDescription, UIElement } from "./BotTypes";

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
