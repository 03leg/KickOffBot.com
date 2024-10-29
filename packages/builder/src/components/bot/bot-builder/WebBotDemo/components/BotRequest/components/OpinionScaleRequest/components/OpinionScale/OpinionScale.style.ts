import { makeStyles } from "tss-react/mui";

const paddingLeftRight1 = 10;
const paddingLeftRight2 = 8;
const paddingLeftRight3 = 7;

export const useOpinionScaleStyles = makeStyles()(
  ({ spacing, breakpoints, palette }) => ({
    toggleButtonGroup: {
      marginRight: spacing(1),
    },
    maxMinLabels: {
      display: "flex",
      justifyContent: "space-between",
    },
    labelLeft: {
      maxWidth: "50%",
      marginRight: spacing(0.4),
      textAlign: "start",
    },
    labelRight: {
      maxWidth: "50%",
      marginLeft: spacing(0.4),
      textAlign: "end",
    },
    toggleButton: {
      [breakpoints.up(450)]: {
        width: "40px",
      },
      [breakpoints.down(380)]: {
        paddingRight: paddingLeftRight1,
        paddingLeft: paddingLeftRight1,
      },
      [breakpoints.down(360)]: {
        paddingRight: paddingLeftRight2,
        paddingLeft: paddingLeftRight2,
      },
      [breakpoints.down(320)]: {
        paddingRight: paddingLeftRight3,
        paddingLeft: paddingLeftRight3,
      },
    },
    eachOptionLabels:{
      paddingLeft: spacing(1),
    }
  })
);
