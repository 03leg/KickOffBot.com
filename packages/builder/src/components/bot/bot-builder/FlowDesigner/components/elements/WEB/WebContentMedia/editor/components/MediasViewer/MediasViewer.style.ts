import { makeStyles } from "tss-react/mui";
import { Colors } from "~/themes/Colors";

export const useMediasViewerStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    alignItems: "flex-start",
    margin: spacing(1, 0),
    padding: spacing(1, 1),
    border: `1px solid ${Colors.BORDER}`,
    overflow: "auto",
  },
  empty: {
    width: "100%",
    textAlign: "center",
  },
}));
