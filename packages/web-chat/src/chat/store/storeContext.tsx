import { ChatItemWebRuntime, UIElement, MessageDescriptionWebRuntime, ChatItemTypeWebRuntime, BotMessageBodyType } from "@kickoffbot.com/types";
import React from "react";
import { v4 } from "uuid";
import { create, StoreApi, UseBoundStore } from "zustand";
import { ChatStoreState } from "./store.types";
import { delay } from "../utils/delay";

export const KickoffbotChatContext = React.createContext<UseBoundStore<StoreApi<ChatStoreState>> | null>(null);

export const KickoffbotChatStoreProvider = ({ children }: React.PropsWithChildren) => {
  const [store] = React.useState(() =>
    create<ChatStoreState>()((set, get) => ({
      chatItems: [],
      errorMessages: [],
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
      clearHistory: () => set(() => ({ chatItems: [], errorMessages: [] })),
      removeChatItemByUIElementId: (elementIds: UIElement["id"][]) =>
        set((state) => ({
          chatItems: state.chatItems.filter((m) => !elementIds.includes(m.uiElementId ?? "")),
        })),
      removeChatItem: (id: string) =>
        set((state) => ({
          chatItems: state.chatItems.filter((m) => m.id !== id),
        })),
      showError: (message: string) =>
        set((state) => ({
          errorMessages: [...state.errorMessages, message],
        })),
      sendUserResponse: (elementId: string, userResponse: MessageDescriptionWebRuntime) =>
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

      setChatItems: (items: ChatItemWebRuntime[]) => set(() => ({ chatItems: items })),
    }))
  );

  return <KickoffbotChatContext.Provider value={store}>{children}</KickoffbotChatContext.Provider>;
};
