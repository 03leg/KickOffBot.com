import { create } from "zustand";
import { ThemeDesignerState } from "./store.types";
import {
  AvatarSettings,
  AvatarView,
  BackgroundColorSchema,
  MessageAppearanceDescription,
  PrimaryColors,
  WebChatBackgroundDescription,
  WebChatTheme,
} from "@kickoffbot.com/types";
import { orange } from "@mui/material/colors";

const defaultInitialTheme: WebChatTheme = {
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
};

export const useThemeDesignerStore = create<ThemeDesignerState>()(
  (set, get) => ({
    themeTitle: "",
    mode: "view",
    currentThemeId: null,
    primaryColors: {
      ...defaultInitialTheme.primaryColors,
    },
    background: {
      ...defaultInitialTheme.background,
    },
    userMessageAppearance: {
      ...defaultInitialTheme.userMessageAppearance,
      avatarSettings: {
        ...defaultInitialTheme.userMessageAppearance.avatarSettings,
      },
    },
    botMessageAppearance: {
      ...defaultInitialTheme.botMessageAppearance,
      avatarSettings: {
        ...defaultInitialTheme.botMessageAppearance.avatarSettings,
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
          ...defaultInitialTheme,
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
  })
);
