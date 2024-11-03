import { AvatarSettings, AvatarView } from "@kickoffbot.com/types";
import { makeStyles } from "tss-react/mui";

function getAvatarSize(settings?: AvatarSettings) {
  switch (settings?.avatarSize) {
    case "small":
      return 24;
    case "medium":
      return 32;
    case "large":
      return 48;
  }
  return 32;
}

export const useBotAvatarStyles = makeStyles<{
  role: "bot" | "user";
  settings?: AvatarSettings;
}>()(({ spacing }, options) => ({
  root: {
    margin: options.role === "bot" ? spacing(0, 1, 0, 1) : spacing(0, 0, 0, 1),
  },
  avatar: {
    height: getAvatarSize(options?.settings),
    width: getAvatarSize(options?.settings),
    backgroundColor: options.settings?.avatarView === AvatarView.ColorInitials ? options.settings?.avatarColor : undefined,
    borderRadius: "50%",
  },
}));
