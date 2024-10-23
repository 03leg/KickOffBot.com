import { create } from "zustand";
import { ThemeDesignerState } from "./store.types";
import {
  AvatarSettings,
  AvatarView,
  BackgroundColorSchema,
  MessageAppearanceDescription,
  PrimaryColors,
  WebChatBackgroundDescription,
} from "@kickoffbot.com/types";
import { orange } from "@mui/material/colors";

export const useThemeDesignerStore = create<ThemeDesignerState>()(
  (set, get) => ({
    primaryColors: {
      main: orange[900],
      contrastText: "#fff",
    },
    background: {
      schema: BackgroundColorSchema.OneColor,
      color1: "#ffffff",
      color2: "#ffffff",
      paperColor: "#ffffff",
    },
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
    setBackground: (background: Partial<WebChatBackgroundDescription>) =>
      set((state) => {
        return {
          background: { ...state.background, ...background },
        };
      }),
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
    setPrimaryColors: (primaryColors: Partial<PrimaryColors>) =>
      set((state) => {
        return {
          primaryColors: { ...state.primaryColors, ...primaryColors },
        };
      }),
  })
);
