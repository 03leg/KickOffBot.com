import { ButtonDescription, ButtonsOrientation, ButtonStyle } from "./types";

export interface InitOptionsBase {
  botId: string;
  externalVariables?: Record<string, unknown>;
}

export interface EmbeddedChatInitOptions extends InitOptionsBase {
  containerId: string;
}

export interface EmbeddedChatButtonsInitOptions {
  buttons: ButtonDescription[];
  buttonsOrientation: ButtonsOrientation;
  buttonStyle: ButtonStyle;
  buttonColor: string;
  buttonWidth?: string;
  buttonCssClasses?: string;

  containerId: string;
  externalVariables?: Record<string, unknown>;
}

export interface PopupChatInitOptions extends InitOptionsBase {}
