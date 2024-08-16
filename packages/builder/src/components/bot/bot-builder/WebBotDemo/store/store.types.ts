import { ChatItem, NormalMessage, RequestDescription } from "../types";

export interface ChatStoreState {
  botIsTyping: boolean;
  chatItems: ChatItem[];
  sendBotMessage: (item: NormalMessage) => Promise<void>;
  clearHistory: VoidFunction;

  sendBotRequest: (request: RequestDescription) => string;
  removeChatItem: (id: string) => void;
  sendUserResponse: (response: NormalMessage) => void;
}
