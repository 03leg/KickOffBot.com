import { WebChatBackgroundDescription } from "@kickoffbot.com/types";

export interface ThemeDesignerState {
  background: WebChatBackgroundDescription;
  setBackground: (background: WebChatBackgroundDescription) => void;
}
