import { makeStyles } from "tss-react/mui";

export const useMultipleChoiceButtonStyles = makeStyles()(
  ({ spacing, breakpoints }) => ({
    root: {
      margin: spacing(0, 1, 1, 0),
     
      "&.MuiButtonBase-root": {
        paddingLeft: spacing(1),
      },
      "& svg": {
        paddingRight: spacing(0.5),
      },
    },
  })
);
