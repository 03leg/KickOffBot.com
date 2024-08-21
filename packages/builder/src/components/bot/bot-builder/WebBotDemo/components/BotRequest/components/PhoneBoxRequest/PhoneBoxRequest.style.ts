import { makeStyles } from "tss-react/mui";

export const usePhoneBoxRequestStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  textField: {
    flex: 1,
    marginRight: spacing(1),
  },
}));
