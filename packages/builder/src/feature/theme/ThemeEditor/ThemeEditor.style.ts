import { makeStyles } from "tss-react/mui";

export const useThemeEditorStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  themeSelectorContainer: {
    display: "flex",
    width: "50%",
    padding: spacing(2, 0, 2, 2),
  },
  chatContainer: {
    display: "flex",
    width: "50%",
    padding: spacing(2),
  },
}));
