import { AvatarSettings, MessageAppearanceDescription, WebChatBackgroundDescription } from "@kickoffbot.com/types";

export interface ThemeDesignerState {
  background: WebChatBackgroundDescription;
  setBackground: (background: WebChatBackgroundDescription) => void;

  userMessageAppearance: Required<MessageAppearanceDescription>;
  setUserMessageAppearance: (userMessageAppearance: MessageAppearanceDescription) => void;
  setUserMessageAvatarAppearance: (avatarSettings: AvatarSettings) => void;

  botMessageAppearance: Required<MessageAppearanceDescription>;
  setBotMessageAppearance: (userMessageAppearance: MessageAppearanceDescription) => void;
  setBotMessageAvatarAppearance: (avatarSettings: AvatarSettings) => void;

}
