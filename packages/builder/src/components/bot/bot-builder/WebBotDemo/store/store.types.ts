import { ChatItemWebRuntime, MessageDescriptionWebRuntime, UIElement } from "@kickoffbot.com/types";

export interface ChatStoreState {
  botIsTyping: boolean;
  chatItems: ChatItemWebRuntime[];
  sendBotMessage: (item: ChatItemWebRuntime) => Promise<void>;
  sendBotRequest: (item: ChatItemWebRuntime) => void;
  sendUserResponse: (id: string, userResponse: MessageDescriptionWebRuntime) => void;
  clearHistory: VoidFunction;


  removeChatItem: (id: string) => void;
  
  removeChatItemByUIElementId: (elementId: UIElement["id"][]) => void;
  setLoadingValue: (value: boolean) => void;
}
