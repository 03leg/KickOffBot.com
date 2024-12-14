import { BotVariable, ElementType } from "./BotTypes";

export enum WebBotLogsType {
  ERROR = "error",
  WARNING = "warning",
  DEBUG = "debug",
}

export interface WebBotLogElementPoint {
  blockId: string;
  elementId: string;
}
export interface WebBotLogMessage {
  message: string;
  attachmentsCount: number;
}

export enum WebBotLogType {
  MESSAGE = "message",
  CHANGE_VARIABLE = "change_variable",
  REQUEST_VARIABLE = "request_variable",
  CURRENT_STATE = "current_state",
  USER_INPUT = "user_input",
}

export interface WebBotLogItemBase {
  time: string;
  logItemType: WebBotLogType;
}

export interface WebBotLogUserInputItem extends WebBotLogItemBase {
  logItemType: WebBotLogType.USER_INPUT;
  elementType: ElementType;
  value: string;
}

export interface WebBotLogCurrentStateItem extends WebBotLogItemBase {
  logItemType: WebBotLogType.CURRENT_STATE;
  currentState: Record<BotVariable["name"], string>;
}

export interface WebBotLogRequestVariableItem extends WebBotLogItemBase {
  logItemType: WebBotLogType.REQUEST_VARIABLE;
  variableName: BotVariable["name"];
  returnValue: string;
}

export interface WebBotLogChangeVariableItem extends WebBotLogItemBase {
  logItemType: WebBotLogType.CHANGE_VARIABLE;
  variableName: BotVariable["name"];
  variableType: BotVariable["type"];

  newValue: string;
  newValueType: string;
}

export interface WebBotLogItem extends WebBotLogItemBase {
  message: string;
  type: WebBotLogsType;
  elementPoint?: WebBotLogElementPoint;
  botMessage: WebBotLogMessage;
  logItemType: WebBotLogType.MESSAGE;
}
