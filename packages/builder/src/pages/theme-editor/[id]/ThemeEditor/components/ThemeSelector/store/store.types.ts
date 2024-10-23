import {
  AvatarSettings,
  MessageAppearanceDescription,
  PrimaryColors,
  WebChatBackgroundDescription,
} from "@kickoffbot.com/types";

export interface ThemeDesignerState {
  primaryColors: PrimaryColors;
  setPrimaryColors: (primaryColors: Partial<PrimaryColors>) => void;


  background: WebChatBackgroundDescription;
  setBackground: (background: Partial<WebChatBackgroundDescription>) => void;

  userMessageAppearance: Required<MessageAppearanceDescription>;
  setUserMessageAppearance: (
    userMessageAppearance: MessageAppearanceDescription
  ) => void;
  setUserMessageAvatarAppearance: (avatarSettings: AvatarSettings) => void;

  botMessageAppearance: Required<MessageAppearanceDescription>;
  setBotMessageAppearance: (
    userMessageAppearance: MessageAppearanceDescription
  ) => void;
  setBotMessageAvatarAppearance: (avatarSettings: AvatarSettings) => void;
}
