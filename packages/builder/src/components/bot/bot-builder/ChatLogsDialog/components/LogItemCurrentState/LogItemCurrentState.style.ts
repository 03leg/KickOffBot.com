import { makeStyles } from "tss-react/mui";

export const useLogItemCurrentStateStyles = makeStyles()(
  ({ spacing, palette }) => ({
    button: {
      textTransform: "none",
      lineHeight: 1.1,
    },
    time: {
      marginRight: spacing(1),
    },
  })
);
