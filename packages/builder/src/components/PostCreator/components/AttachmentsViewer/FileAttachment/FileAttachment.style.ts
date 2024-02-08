import { makeStyles } from "tss-react/mui";
import { Colors } from "~/themes/Colors";

export const useFileAttachmentStyles = makeStyles()(({ spacing }) => ({
  action: {
    backgroundColor: Colors.WHITE,
  },
  root: {
    display: "flex",
    alignItems: "center",
    padding: spacing(1),
    border: `1px solid ${Colors.BORDER}`,
    marginRight: spacing(1),
  },
}));
