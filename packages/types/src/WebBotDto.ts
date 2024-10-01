import { ChatItemWebRuntime } from "./WebBotTypes";

export interface WebBotResponse {
  newItems: ChatItemWebRuntime[];
}

export interface StartSavedBotResponse extends WebBotResponse {
  runtimeProjectId: string;
}
