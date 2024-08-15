import { ChatItem, NormalMessage } from "../types";

export interface ChatStoreState {
  messages: ChatItem[];
  sendBotMessage: (item: NormalMessage) => void;
  clearHistory: VoidFunction;
}
