import { makeStyles } from "tss-react/mui";

export const useEmbeddedChatInfoStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginBottom: spacing(1),
  },
}));
