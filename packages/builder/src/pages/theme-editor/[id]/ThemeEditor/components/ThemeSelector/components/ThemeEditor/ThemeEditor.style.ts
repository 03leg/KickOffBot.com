import { makeStyles } from "tss-react/mui";
import { Colors } from "~/themes/Colors";

export const useThemeEditorStyles = makeStyles()(({ spacing }) => ({
  root: {
    backgroundColor: "white",
    border: `1px solid ${Colors.BORDER}`,
    padding: spacing(1),
    borderRadius: spacing(1),
    width: "100%",
    height: "100%",
    overflow: "auto",
  },
  actionButton: {
    marginLeft: spacing(1),
    textTransform: "none",
  },
  themeName: {
    marginTop: spacing(2),
  },
  actionButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));
