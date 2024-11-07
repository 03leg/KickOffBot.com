import { makeStyles } from "tss-react/mui";

export const usePublishWebBotDialogStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: spacing(1, 0),
  },
  link: {
    display: "flex",
    marginTop: spacing(1),
  },
  copyButton: {
    marginLeft: spacing(0.5),
  },
  info: {
    marginTop: spacing(2),
  },
  integrationTab: {
    textTransform: "none",
  },
}));
