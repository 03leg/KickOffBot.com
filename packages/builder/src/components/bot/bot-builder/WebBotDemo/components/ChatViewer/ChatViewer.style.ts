import { makeStyles } from "tss-react/mui";

export const useChatViewerStyles = makeStyles<
  { height?: number | string } | undefined
>()(({ palette }, options) => ({
  root: {
    height: options?.height,
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    backgroundColor: palette.background.default,
  },
}));
