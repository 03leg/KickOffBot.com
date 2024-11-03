import { makeStyles } from "tss-react/mui";

export const useEmailBoxRequestStyles = makeStyles()(({ spacing, breakpoints }) => ({
  root: {
    display: "flex",
    alignItems: "center",
    [breakpoints.down("sm")]: {
      width: "calc(100% - 66px)",
    },
  },
  textField: {
    flex: 1,
    marginRight: spacing(1),
  },
}));
