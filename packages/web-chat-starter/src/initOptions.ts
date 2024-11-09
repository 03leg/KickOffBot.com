import { ButtonDescription, ButtonsOrientation, ButtonStyle } from "./types";

export interface EmbeddedChatInitOptions {
  containerId: string;
  botId: string;
}

export interface EmbeddedChatButtonsOptions {
  buttons: ButtonDescription[];
  buttonsOrientation: ButtonsOrientation;
  buttonStyle: ButtonStyle;
  buttonColor: string;
  buttonWidth?: string;
  buttonCssClasses?: string;

  containerId: string;
}

export interface PopupChatInitOptions {
  botId: string;
}
