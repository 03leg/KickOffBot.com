import { ButtonDescription, ButtonsOrientation, ButtonStyle } from "./types";

export interface InitOptionsBase {
  externalVariables?: Record<string, unknown>;
}

export interface EmbeddedChatInitOptions extends InitOptionsBase {
  containerId: string;
  botId: string;
}

export interface EmbeddedChatButtonsInitOptions extends InitOptionsBase {
  buttons: ButtonDescription[];
  buttonsOrientation: ButtonsOrientation;
  buttonStyle: ButtonStyle;
  buttonColor: string;
  buttonWidth?: string;
  buttonCssClasses?: string;

  containerId: string;
}

export interface PopupChatInitOptions extends InitOptionsBase {
  botId: string;
}
