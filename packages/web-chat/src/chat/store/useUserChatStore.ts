import { useStore } from "zustand";
import { ChatStoreState } from "./store.types";
import React from "react";
import { KickoffbotChatContext } from "./storeContext";

export const useUserChatStore = (selector: (state: ChatStoreState) => unknown) => {
  const store = React.useContext(KickoffbotChatContext);
  if (!store) {
    throw new Error("Missing KickoffbotStoreProvider");
  }
  return useStore(store, selector) as ChatStoreState;
};
