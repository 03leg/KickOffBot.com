/* eslint-disable @typescript-eslint/no-unused-vars */
import { ElementType } from '@kickoffbot.com/types';
import { WebUserContext } from '../WebUserContext';
import { LogService, MessageOptions } from './LogService';
import * as moment from 'moment';

export class EmptyLogService implements LogService {
  constructor(author: string, botName: string) {
    console.log(
      `${moment().format()} EmptyLogService initialized. Bot author: ${author}, bot name: ${botName}`,
    );
  }

  logStartPointById(elementId: string): void {}
  logFinishPointById(elementId: string): void {}
  logUserInput(elementType: ElementType, value: unknown): void {}
  logCurrentState(userContext: WebUserContext): void {}
  debug(message: string, options?: MessageOptions): void {}
  warn(message: string, options?: MessageOptions): void {}
  error(message: string, options?: MessageOptions): void {}
  realError(msg: string, error: any): void {}
  logRequestVariable(name: string, value: unknown): void {}
  logChangeVariable(name: string, value: unknown): void {}
}
