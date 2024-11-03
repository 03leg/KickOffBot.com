import { makeStyles } from "tss-react/mui";

export const usePhoneBoxRequestStyles = makeStyles()(
  ({ spacing, breakpoints, palette }) => ({
    root: {
      display: "flex",
      alignItems: "center",
      [breakpoints.down("sm")]: {
        width: "calc(100% - 66px)",
      },
    },
    textField: {
      flex: 1,
      width: "100%",
      marginRight: spacing(1),
    },
    dialCode: {
      color: palette.text.secondary,
    },
  })
);
