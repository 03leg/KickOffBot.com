import { makeStyles } from "tss-react/mui";

export const useWebDateTimeInputEditorStyles = makeStyles()(({ spacing }) => ({
  editorTitle: {
    marginTop: spacing(1),
  },
  variableSelector: {
    marginTop: spacing(1),
  },
  parkTimeContainer: {
    marginTop: spacing(1),
    display: "flex",
  },
  parkTimeTypeSelector: {
    marginLeft: spacing(1),
    width: "auto",
  },
}));
