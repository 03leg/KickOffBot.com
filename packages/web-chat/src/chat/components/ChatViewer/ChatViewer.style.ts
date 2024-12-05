import { WebChatTheme } from "@kickoffbot.com/types";
import { makeStyles } from "tss-react/mui";
import {
  getBackgroundColor,
  getBackgroundImage,
} from "../../theme/createChatTheme.utils";
import { getFontFamily } from "../../theme/FontFamily";

export const useChatViewerStyles = makeStyles<
  { height?: number | string; webViewOptions?: WebChatTheme } | undefined
>()(({ palette }, options) => ({
  viewPort: {
    height: "100%",
    width: "100%",
    backgroundColor: palette.background.default,
    background: getBackgroundColor(options?.webViewOptions?.background),
    backgroundImage: getBackgroundImage(options?.webViewOptions?.background),
    display: "flex",
    justifyContent: "center",
    fontFamily: getFontFamily(),
    position: "relative",
  },
  root: {
    height: options?.height,
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    maxWidth: "900px",
    width: "100%",
  },
}));
