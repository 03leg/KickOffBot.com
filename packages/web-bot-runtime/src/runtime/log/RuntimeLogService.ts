import {
  WebBotLogItemBase,
  BotProject,
  ElementType,
  WebBotLogUserInputItem,
  WebBotLogType,
  WebBotLogCurrentStateItem,
  BotVariable,
  WebBotLogRequestVariableItem,
  WebBotLogChangeVariableItem,
  WebBotLogsType,
  WebBotLogItem,
} from '@kickoffbot.com/types';
import { WebUserContext } from '../WebUserContext';
import { getValueType } from './getValueType';
import { LogService, MessageOptions } from './LogService';

export class RuntimeLogService implements LogService {
  private items: WebBotLogItemBase[] = [];

  constructor(private _botProject: BotProject) {}

  public logStartPointById(elementId: string) {
    const block = this._botProject.blocks.find((b) =>
      b.elements.map((e) => e.id).includes(elementId),
    );

    this.debug('<>', { elementPoint: { blockId: block.id, elementId } });
  }

  public logFinishPointById(elementId: string) {
    const block = this._botProject.blocks.find((b) =>
      b.elements.map((e) => e.id).includes(elementId),
    );

    this.debug('</>', { elementPoint: { blockId: block.id, elementId } });
  }

  public logUserInput(elementType: ElementType, value: unknown) {
    const valueType = getValueType(value);
    const newItem: WebBotLogUserInputItem = {
      time: new Date().toISOString(),
      logItemType: WebBotLogType.USER_INPUT,
      elementType,
      value: ['object', 'array'].includes(valueType)
        ? JSON.stringify(value, null, 2)
        : value.toString(),
    };

    this.items.push(newItem);
  }

  public logCurrentState(userContext: WebUserContext) {
    const state = userContext.getCurrentState();
    const response: Record<string, string> = {};

    const data = Object.fromEntries(state.entries());

    for (const key of Object.keys(data)) {
      const value = data[key];

      const t = getValueType(value);

      response[key] = ['object', 'array'].includes(t)
        ? JSON.stringify(value, null, 2)
        : value.toString();
    }

    const item: WebBotLogCurrentStateItem = {
      time: new Date().toISOString(),
      logItemType: WebBotLogType.CURRENT_STATE,
      currentState: response,
    };

    this.items.push(item);
  }

  public logRequestVariable(variableName: BotVariable['name'], value: unknown) {
    const t = getValueType(value);

    const item: WebBotLogRequestVariableItem = {
      time: new Date().toISOString(),
      logItemType: WebBotLogType.REQUEST_VARIABLE,
      variableName,
      returnValue: ['object', 'array'].includes(t)
        ? JSON.stringify(value, null, 2)
        : value.toString(),
    };

    this.items.push(item);
  }

  public logChangeVariable(
    variableName: BotVariable['name'],
    newValue: unknown,
  ) {
    const botVariable = this._botProject.variables.find(
      (v) => v.name === variableName,
    );
    if (!botVariable) {
      this.warn("Variable with name '" + name + "' not found for update");
      return;
    }

    const t = getValueType(newValue);
    const item: WebBotLogChangeVariableItem = {
      time: new Date().toISOString(),
      logItemType: WebBotLogType.CHANGE_VARIABLE,
      variableName: botVariable.name,
      variableType: botVariable.type,
      newValue: ['object', 'array'].includes(t)
        ? JSON.stringify(newValue, null, 2)
        : newValue.toString(),
      newValueType: t,
    };

    this.items.push(item);
  }

  public warn(message: string, options?: MessageOptions) {
    this.addLogItem(message, WebBotLogsType.WARNING, options);
  }

  public debug(message: string, options?: MessageOptions) {
    this.addLogItem(message, WebBotLogsType.DEBUG, options);
  }

  public error(message: string) {
    this.addLogItem(message, WebBotLogsType.ERROR);
  }

  public realError(msg: string, error: any) {
    let message = msg;

    if (error.hasOwnProperty('message')) {
      message += ': ' + error.message;
    }

    if (error.hasOwnProperty('stack')) {
      message += '\n' + error.stack;
    }

    if (error.hasOwnProperty('cause')) {
      message += '\n' + error.cause;
    }

    if (error.hasOwnProperty('originalError')) {
      message += '\n' + error.originalError;
    }

    if (error.hasOwnProperty('originalStack')) {
      message += '\n' + error.originalStack;
    }

    this.addLogItem(message, WebBotLogsType.ERROR);
  }

  private addLogItem(
    message: string,
    type: WebBotLogsType,
    options?: MessageOptions,
  ) {
    const item: WebBotLogItem = {
      time: new Date().toISOString(),
      message,
      type,
      elementPoint: options?.elementPoint,
      botMessage: options?.botMessage,
      logItemType: WebBotLogType.MESSAGE,
    };
    this.items.push(item);
  }

  public getLogs() {
    return this.items;
  }
}
