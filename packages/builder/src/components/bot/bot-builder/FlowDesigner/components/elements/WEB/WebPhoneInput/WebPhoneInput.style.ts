import { makeStyles } from "tss-react/mui";

export const useWebPhoneInputStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
}));
