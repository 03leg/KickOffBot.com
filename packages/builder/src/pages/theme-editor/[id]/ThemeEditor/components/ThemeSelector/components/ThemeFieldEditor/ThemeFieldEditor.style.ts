import { makeStyles } from "tss-react/mui";

export const useThemeFieldEditorStyles = makeStyles()(({ spacing }) => ({
  root: {
    width: "100%",
    display: "flex",
    marginTop: spacing(1.5),
  },
  fieldTitle: {
    width: "30%",
    display: "flex",
    alignItems: "center",
  },
  fieldContent: {
    width: "70%",
  },
}));
