import {
  ElementType,
  WebBotLogElementPoint,
  WebBotLogMessage,
} from '@kickoffbot.com/types';
import { WebUserContext } from '../WebUserContext';

export interface MessageOptions {
  elementPoint?: WebBotLogElementPoint;
  botMessage?: WebBotLogMessage;
}

export interface LogService {
  logStartPointById(elementId: string): void;
  logFinishPointById(elementId: string): void;
  logUserInput(elementType: ElementType, value: unknown): void;
  logCurrentState(userContext: WebUserContext): void;
  debug(message: string, options?: MessageOptions): void;
  warn(message: string, options?: MessageOptions): void;
  error(message: string, options?: MessageOptions): void;
  realError(msg: string, error: any): void;
  logRequestVariable(name: string, value: unknown): void;
  logChangeVariable(name: string, value: unknown): void;
}
