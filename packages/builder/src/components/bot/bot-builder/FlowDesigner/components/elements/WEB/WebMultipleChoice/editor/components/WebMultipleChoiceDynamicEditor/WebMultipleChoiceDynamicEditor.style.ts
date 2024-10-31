import { makeStyles } from "tss-react/mui";

export const useWebMultipleChoiceDynamicEditorStyles = makeStyles()(
  ({ spacing }) => ({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
    row: {
      display: "flex",
      marginTop: spacing(2),
      width: "100%",
    },
  })
);
