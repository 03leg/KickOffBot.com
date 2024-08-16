import { FileDescription, WebInputTextUIElement } from "@kickoffbot.com/types";

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
  element: WebInputTextUIElement;
  onResponse: (response: ResponseDescription) => void;
}

export interface ChatItem {
  id: string;
  itemType: ChatItemType;
  content: NormalMessage | RequestDescription;
}
