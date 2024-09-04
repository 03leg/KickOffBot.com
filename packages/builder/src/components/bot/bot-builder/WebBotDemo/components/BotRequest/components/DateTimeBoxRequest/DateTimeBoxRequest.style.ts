import { makeStyles } from "tss-react/mui";

export const useDateTimeBoxRequestStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    alignItems: "center",
    // width: "90%",
  },
  textField: {
    flex: 1,
    marginRight: spacing(1),
  },
  picker: {
    width: "100%",
  },
}));
