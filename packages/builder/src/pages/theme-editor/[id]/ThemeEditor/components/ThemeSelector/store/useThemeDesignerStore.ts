import { create } from "zustand";
import { ThemeDesignerState } from "./store.types";
import {
  AvatarSettings,
  AvatarView,
  BackgroundColorSchema,
  MessageAppearanceDescription,
  WebChatBackgroundDescription,
} from "@kickoffbot.com/types";

export const useThemeDesignerStore = create<ThemeDesignerState>()(
  (set, get) => ({
    background: {
      schema: BackgroundColorSchema.OneColor,
      color1: "#ffffff",
      color2: "#ffffff",
    },
    setBackground: (background: Partial<WebChatBackgroundDescription>) =>
      set((state) => {
        return {
          background: { ...state.background, ...background },
        };
      }),
    userMessageAppearance: {
      avatarSettings: {
        showAvatar: false,
        avatarSize: "medium",
        avatarView: AvatarView.ColorInitials,
        avatarColor: "#bbb",
      },
      backgroundColor: "#c5ecbe",
      textColor: "#000000",
    },
    setUserMessageAppearance: (
      userMessageAppearance: Partial<MessageAppearanceDescription>
    ) =>
      set((state) => {
        return {
          userMessageAppearance: {
            ...state.userMessageAppearance,
            ...userMessageAppearance,
          },
        };
      }),
    setUserMessageAvatarAppearance: (avatarSettings: Partial<AvatarSettings>) =>
      set((state) => {
        return {
          userMessageAppearance: {
            ...state.userMessageAppearance,
            avatarSettings: {
              ...state.userMessageAppearance.avatarSettings,
              ...avatarSettings,
            },
          },
        };
      }),
    botMessageAppearance: {
      backgroundColor: "#e3e3e3",
      textColor: "#000000",
      avatarSettings: {
        showAvatar: true,
        avatarSize: "medium",
        avatarView: AvatarView.ColorInitials,
        avatarColor: "#bbb",
      },
    },
    setBotMessageAppearance: (
      botMessageAppearance: Partial<MessageAppearanceDescription>
    ) =>
      set((state) => {
        return {
          botMessageAppearance: {
            ...state.botMessageAppearance,
            ...botMessageAppearance,
          },
        };
      }),
    setBotMessageAvatarAppearance: (avatarSettings: Partial<AvatarSettings>) =>
      set((state) => {
        return {
          botMessageAppearance: {
            ...state.botMessageAppearance,
            avatarSettings: {
              ...state.botMessageAppearance.avatarSettings,
              ...avatarSettings,
            },
          },
        };
      }),
  })
);
