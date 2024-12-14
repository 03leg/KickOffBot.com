import { makeStyles } from "tss-react/mui";

export const useChatLogsDialogStyles = makeStyles()(({ spacing, palette }) => ({
  root: {
    width: "100%",
    padding: spacing(1, 1),
  },
}));
