import {
  FileDescription,
  WebInputButtonsUIElement,
  WebInputDateTimeUIElement,
  WebInputEmailUIElement,
  WebInputNumberUIElement,
  WebInputPhoneUIElement,
  WebInputTextUIElement,
} from "@kickoffbot.com/types";
import { WebUserContext } from "./runtime/WebUserContext";
import { WebBotManagerUtils } from "./runtime/WebBotManager.utils";

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
    | WebInputPhoneUIElement
    | WebInputEmailUIElement
    | WebInputButtonsUIElement
    | WebInputDateTimeUIElement;
  onResponse: (response: ResponseDescription) => void;
  userContext: WebUserContext;
  utils: WebBotManagerUtils;
}

export interface ChatItem {
  id: string;
  itemType: ChatItemType;
  content: NormalMessage | RequestDescription;
}
