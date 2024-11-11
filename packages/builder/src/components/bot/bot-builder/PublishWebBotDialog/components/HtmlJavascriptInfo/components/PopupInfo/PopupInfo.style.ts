import { makeStyles } from "tss-react/mui";

export const usePopupInfoStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginBottom: spacing(1),
  },
}));
