import { UIElement } from "@kickoffbot.com/types";
import { ChatItem, NormalMessage, RequestDescription } from "../types";

export interface ChatStoreState {
  botIsTyping: boolean;
  chatItems: ChatItem[];
  sendBotMessage: (elementId: UIElement["id"], item: NormalMessage) => Promise<void>;
  clearHistory: VoidFunction;

  sendBotRequest: (request: RequestDescription) => string;
  removeChatItem: (id: string) => void;
  sendUserResponse: (elementId: UIElement["id"], response: NormalMessage) => void;
  
  removeChatItemByUIElementId: (elementId: UIElement["id"][]) => void;
}
