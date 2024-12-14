import { makeStyles } from "tss-react/mui";

export const useLogItemRequestVariableStyles = makeStyles()(
  ({ spacing, palette }) => ({
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    time: {
      marginRight: spacing(1),
    },
    valueLink: {
      cursor: "pointer",
      //   marginLeft: spacing(1),
    },
  })
);
