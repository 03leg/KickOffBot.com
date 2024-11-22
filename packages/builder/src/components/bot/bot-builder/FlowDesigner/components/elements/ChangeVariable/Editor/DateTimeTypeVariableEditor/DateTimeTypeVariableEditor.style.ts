import { makeStyles } from "tss-react/mui";

export const useDateTimeTypeVariableEditorStyles = makeStyles()(
  ({ spacing }) => ({
    root: {
      display: "flex",
      flexDirection: "column",
    },
    valueEditors: {
      marginTop: spacing(2),
    },
    durationContainer: {
      marginTop: spacing(1),
      display: "flex",
    },
    durationTypeSelect: {
      marginLeft: spacing(1),
      width: "auto",
    },
  })
);
