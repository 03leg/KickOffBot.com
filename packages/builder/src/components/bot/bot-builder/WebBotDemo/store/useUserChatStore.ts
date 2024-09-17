import { create } from "zustand";
import { ChatStoreState } from "./store.types";
import { delay } from "../../utils";
import {
  BotMessageBodyType,
  ChatItemTypeWebRuntime,
  ChatItemWebRuntime,
  MessageDescriptionWebRuntime,
  UIElement,
} from "@kickoffbot.com/types";
import { v4 } from "uuid";

export const useUserChatStore = create<ChatStoreState>()((set, get) => ({
  chatItems: [],
  botIsTyping: false,
  setLoadingValue: (value: boolean) => set(() => ({ botIsTyping: value })),
  sendBotMessage: async (item: ChatItemWebRuntime) => {
    set(() => ({ botIsTyping: true }));

    await delay(750);

    set((state) => {
      const messages: ChatItemWebRuntime[] = [...state.chatItems, item];

      return { chatItems: messages, botIsTyping: false };
    });
  },
  sendBotRequest: (item: ChatItemWebRuntime) => {
    set((state) => {
      const messages: ChatItemWebRuntime[] = [...state.chatItems, item];

      return { chatItems: messages };
    });
  },
  clearHistory: () => set(() => ({ chatItems: [] })),
  removeChatItemByUIElementId: (elementIds: UIElement["id"][]) =>
    set((state) => ({
      chatItems: state.chatItems.filter(
        (m) => !elementIds.includes(m.uiElementId ?? "")
      ),
    })),
  removeChatItem: (id: string) =>
    set((state) => ({
      chatItems: state.chatItems.filter((m) => m.id !== id),
    })),
  sendUserResponse: (
    elementId: string,
    userResponse: MessageDescriptionWebRuntime
  ) =>
    set((state) => ({
      chatItems: [
        ...state.chatItems,
        {
          itemType: ChatItemTypeWebRuntime.USER_MESSAGE,
          content: {
            content: userResponse,
            type: BotMessageBodyType.MessageAndAttachments,
          },
          id: v4(),
          uiElementId: elementId,
        },
      ],
    })),
}));
