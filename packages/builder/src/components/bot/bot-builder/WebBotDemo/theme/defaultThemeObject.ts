import {
  WebChatTheme,
  BackgroundColorSchema,
  AvatarView,
} from "@kickoffbot.com/types";
import { blue } from "@mui/material/colors";

export const defaultThemeObject: WebChatTheme = {
  primaryColors: {
    main: blue[800],
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
    backgroundColor: "#f0f0f0",
    textColor: "#000000",
  },
  botMessageAppearance: {
    backgroundColor: "#1565c0",
    textColor: "#ffffff",
    avatarSettings: {
      showAvatar: true,
      avatarSize: "medium",
      avatarView: AvatarView.ColorInitials,
      avatarColor: "#bbb",
    },
  },
};
