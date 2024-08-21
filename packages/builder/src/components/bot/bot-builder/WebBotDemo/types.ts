import {
  FileDescription,
  WebInputDateTimeUIElement,
  WebInputNumberUIElement,
  WebInputTextUIElement,
} from "@kickoffbot.com/types";
import { WebUserContext } from "./runtime/WebUserContext";

export interface NormalMessage {
  message?: string;
  attachments?: FileDescription[];
}

export enum ChatItemType {
  BOT_MESSAGE = "bot-message",
  BOT_REQUEST = "bot-request",
  USER_MESSAGE = "user-message",
  SYSTEM_MESSAGE = "system-message",
}

export interface ResponseDescription {
  data: unknown;
}

export interface RequestDescription {
  element:
    | WebInputTextUIElement
    | WebInputNumberUIElement
    | WebInputDateTimeUIElement;
  onResponse: (response: ResponseDescription) => void;
  userContext: WebUserContext;
}

export interface ChatItem {
  id: string;
  itemType: ChatItemType;
  content: NormalMessage | RequestDescription;
}
