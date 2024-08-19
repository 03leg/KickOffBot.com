import { makeStyles } from "tss-react/mui";

export const useNumberBoxRequestStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "60%",
  },
  textField: {
    flex: 1,
    marginRight: spacing(1),
  },
}));
