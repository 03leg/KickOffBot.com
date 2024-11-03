import { makeStyles } from "tss-react/mui";

export const useErrorMessagesStyles = makeStyles()(({ spacing }) => ({
  root: {
    padding: spacing(2),
  },
  error: {
    marginBottom: spacing(1),
  },
}));
