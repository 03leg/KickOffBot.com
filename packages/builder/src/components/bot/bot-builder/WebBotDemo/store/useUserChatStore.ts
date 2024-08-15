import { create } from "zustand";
import { ChatStoreState } from "./store.types";
import { ChatItem, ChatItemType, NormalMessage } from "../types";
import { v4 } from "uuid";

export const useUserChatStore = create<ChatStoreState>()((set, get) => ({
  messages: [],
  sendBotMessage: (message: NormalMessage) =>
    set((state) => {
      const messages: ChatItem[] = [
        ...state.messages,
        {
          itemType: ChatItemType.BOT_MESSAGE,
          content: message,
          id: v4(),
        },
      ];

      return { messages };
    }),
  clearHistory: () => set(() => ({ messages: [] })),
}));
