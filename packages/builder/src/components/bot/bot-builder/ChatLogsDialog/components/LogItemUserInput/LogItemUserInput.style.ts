import { makeStyles } from "tss-react/mui";

export const useLogItemUserInputStyles = makeStyles()(
  ({ spacing, palette }) => ({
    root: {
      width: "100%",
      display: "flex",
    },
    elementType: {
      marginLeft: spacing(1),
      padding: spacing(0, 1),
      borderRadius: spacing(1),
    },
    valueLink: {
      cursor: "pointer",
    },
  })
);
