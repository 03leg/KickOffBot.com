import { makeStyles } from "tss-react/mui";

export const useHtmlJavascriptInfoStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    marginTop: spacing(1),
    flexDirection: "column",
  },
  toggleButton: {
    textTransform: "none",
  },
  toggleButtonGroup: {
    justifyContent: "center",
  },
}));
