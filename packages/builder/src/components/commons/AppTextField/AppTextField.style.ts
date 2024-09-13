import { makeStyles } from "tss-react/mui";

export const useAppTextFieldStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
  buttons: {
    marginLeft: spacing(1),
    display: "flex",
  },
}));
