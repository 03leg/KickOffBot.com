import { makeStyles } from "tss-react/mui";

export const useWebLogicBrowserCodeEditorStyles = makeStyles()(
  ({ spacing }) => ({
    root: {
      display: "flex",
      flexDirection: "column",
    },
    variables: {
      marginTop: spacing(1.5),
      marginBottom: spacing(1),
    },
  })
);
