import { makeStyles } from "tss-react/mui";

export const useErrorMessagesStyles = makeStyles()(({ spacing }) => ({
  root: {
    padding: spacing(2),
  },
  error: {
    marginBottom: spacing(1),
  },
  button: {
    textTransform: "none",
    lineHeight: 1.1,
    marginLeft: spacing(1),
  },
}));
