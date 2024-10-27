import { create } from "zustand";
import { ThemeDesignerState } from "./store.types";
import {
  AvatarSettings,
  MessageAppearanceDescription,
  PrimaryColors,
  WebChatBackgroundDescription,
  WebChatTheme,
} from "@kickoffbot.com/types";
import { defaultThemeObject } from "./defaultThemeObject";

export const useThemeDesignerStore = create<ThemeDesignerState>()(
  (set, get) => ({
    themeTitle: "",
    mode: "view",
    currentThemeId: null,
    primaryColors: {
      ...defaultThemeObject.primaryColors,
    },
    background: {
      ...defaultThemeObject.background,
    },
    userMessageAppearance: {
      ...defaultThemeObject.userMessageAppearance,
      avatarSettings: {
        ...defaultThemeObject.userMessageAppearance.avatarSettings,
      },
    },
    botMessageAppearance: {
      ...defaultThemeObject.botMessageAppearance,
      avatarSettings: {
        ...defaultThemeObject.botMessageAppearance.avatarSettings,
      },
    },
    getTheme: () => {
      const result: WebChatTheme = {
        botMessageAppearance: get().botMessageAppearance,
        userMessageAppearance: get().userMessageAppearance,
        primaryColors: get().primaryColors,
        background: get().background,
      };

      return result;
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

    applySavedTheme: (themeId: string, theme: WebChatTheme) => {
      set(() => {
        return {
          primaryColors: theme.primaryColors,
          background: theme.background,
          userMessageAppearance: theme.userMessageAppearance,
          botMessageAppearance: theme.botMessageAppearance,
          currentThemeId: themeId,
        };
      });
    },
    editTheme: (themeId: string, title: string, theme: WebChatTheme) => {
      set(() => {
        return {
          primaryColors: theme.primaryColors,
          background: theme.background,
          userMessageAppearance: theme.userMessageAppearance,
          botMessageAppearance: theme.botMessageAppearance,
          currentThemeId: themeId,
          themeTitle: title,
          mode: "edit",
        };
      });
    },
    createTheme: (title: string) => {
      set(() => {
        return {
          ...defaultThemeObject,
          currentThemeId: null,
          themeTitle: title,
          mode: "edit",
        };
      });
    },
    showGallery: () => {
      set(() => {
        return {
          currentThemeId: null,
          title: "",
          mode: "view",
        };
      });
    },
    changeThemeTitle: (title: string) => set(() => ({ themeTitle: title })),
    resetState: () =>
      set(() => {
        return {
          ...defaultThemeObject,
          currentThemeId: null,
          title: "",
          mode: "view",
        };
      }),
  })
);
