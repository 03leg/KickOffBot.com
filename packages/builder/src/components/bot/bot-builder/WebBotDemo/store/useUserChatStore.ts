import { create } from "zustand";
import { ChatStoreState } from "./store.types";
import {
  ChatItem,
  ChatItemType,
  NormalMessage,
  RequestDescription,
} from "../types";
import { v4 } from "uuid";
import { delay } from "../../utils";
import { UIElement } from "@kickoffbot.com/types";


export const useUserChatStore = create<ChatStoreState>()((set, get) => ({
  chatItems: [],
  botIsTyping: false,
  sendBotMessage: async (
    elementId: UIElement["id"],
    message: NormalMessage
  ) => {
    set(() => ({ botIsTyping: true }));

    await delay(750);

    set((state) => {
      const messages: ChatItem[] = [
        ...state.chatItems,
        {
          itemType: ChatItemType.BOT_MESSAGE,
          content: message,
          id: v4(),
          uiElementId: elementId,
        },
      ];



      return { chatItems: messages, botIsTyping: false };
    });
  },
  clearHistory: () => set(() => ({ chatItems: [] })),
  removeChatItemByUIElementId: (elementIds: UIElement["id"][]) => set((state) => ({ chatItems: state.chatItems.filter((m) => !elementIds.includes(m.uiElementId ?? '')) })),
  sendBotRequest: (request: RequestDescription) => {
    const requestId = v4();

    set((state) => {
      const messages: ChatItem[] = [
        ...state.chatItems,
        {
          itemType: ChatItemType.BOT_REQUEST,
          content: request,
          id: requestId,
        },
      ];

      return { chatItems: messages };
    });

    return requestId;
  },
  removeChatItem: (id: string) =>
    set((state) => ({
      chatItems: state.chatItems.filter((m) => m.id !== id),
    })),
  sendUserResponse: (elementId: UIElement["id"], response: NormalMessage) =>
    set((state) => ({
      chatItems: [
        ...state.chatItems,
        {
          itemType: ChatItemType.USER_MESSAGE,
          content: response,
          id: v4(),
          uiElementId: elementId,
        },
      ],
    })),
}));
