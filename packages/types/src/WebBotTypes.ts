import { ElementType, FileDescription, MessageDescription, UIElement } from "./BotTypes";

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
