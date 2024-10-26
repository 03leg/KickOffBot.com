import {
  AvatarSettings,
  MessageAppearanceDescription,
  PrimaryColors,
  WebChatBackgroundDescription,
  WebChatTheme,
} from "@kickoffbot.com/types";

export interface ThemeDesignerState {
  themeTitle: string;
  changeThemeTitle: (themeTitle: string) => void;

  mode: "view" | "edit";
  getTheme: () => WebChatTheme;

  primaryColors: PrimaryColors;
  setPrimaryColors: (primaryColors: Partial<PrimaryColors>) => void;

  background: WebChatBackgroundDescription;
  setBackground: (background: Partial<WebChatBackgroundDescription>) => void;

  userMessageAppearance: Required<MessageAppearanceDescription>;
  setUserMessageAppearance: (
    userMessageAppearance: Partial<MessageAppearanceDescription>
  ) => void;
  setUserMessageAvatarAppearance: (avatarSettings: AvatarSettings) => void;

  botMessageAppearance: Required<MessageAppearanceDescription>;
  setBotMessageAppearance: (
    userMessageAppearance: Partial<MessageAppearanceDescription>
  ) => void;
  setBotMessageAvatarAppearance: (avatarSettings: AvatarSettings) => void;

  currentThemeId: string | null;
  applySavedTheme: (themeId: string, theme: WebChatTheme) => void;

  editTheme: (themeId: string, title: string, theme: WebChatTheme) => void;
  showGallery: () => void;

  createTheme: (title: string) => void;
  resetState: () => void;
}
