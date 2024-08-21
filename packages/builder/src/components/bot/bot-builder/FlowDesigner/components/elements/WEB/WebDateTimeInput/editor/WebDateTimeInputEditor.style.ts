import { makeStyles } from "tss-react/mui";

export const useWebDateTimeInputEditorStyles = makeStyles()(({ spacing }) => ({
  editorTitle: {
    marginTop: spacing(1),
  },
  variableSelector: {
    marginTop: spacing(1),
  },
}));
