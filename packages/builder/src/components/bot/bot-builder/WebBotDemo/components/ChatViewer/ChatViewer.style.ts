import {
  WebChatTheme,
} from "@kickoffbot.com/types";
import { makeStyles } from "tss-react/mui";
import { getBackgroundColor, getBackgroundImage } from "../../theme/createChatTheme.utils";

export const useChatViewerStyles = makeStyles<
  { height?: number | string; webViewOptions?: WebChatTheme } | undefined
>()(({ palette }, options) => ({
  root: {
    height: options?.height,
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    backgroundColor: palette.background.default,
    background: getBackgroundColor(options?.webViewOptions?.background),
    backgroundImage: getBackgroundImage(options?.webViewOptions?.background)
  },
}));
