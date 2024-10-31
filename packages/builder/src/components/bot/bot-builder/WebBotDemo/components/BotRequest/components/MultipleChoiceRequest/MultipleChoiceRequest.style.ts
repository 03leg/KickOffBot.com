import { makeStyles } from "tss-react/mui";

export const useMultipleChoiceRequestStyles = makeStyles()(
  ({ spacing, breakpoints }) => ({
    root: {
      marginLeft: spacing(1),
      display: "flex",
      alignItems: "end",
    },
    items: {
      display: "flex",
      justifyContent: "flex-end",
      flexWrap: "wrap",
    },
    sendResponse: {
      paddingBottom: spacing(1),
    },
  })
);
