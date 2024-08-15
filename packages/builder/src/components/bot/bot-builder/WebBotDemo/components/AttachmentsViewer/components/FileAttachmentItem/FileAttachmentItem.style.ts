import { makeStyles } from "tss-react/mui";
import { Colors } from "~/themes/Colors";

export const useFileAttachmentItemStyles = makeStyles()(
  ({ spacing, shape }) => ({
    action: {
      backgroundColor: Colors.WHITE,
    },
    root: {
      display: "flex",
      alignItems: "center",
      padding: spacing(1),
      borderRadius: shape.borderRadius,
      border: `1px solid ${Colors.BORDER}`,
      marginRight: spacing(1),
      cursor: "pointer",
      "&:last-child": {
        marginRight: 1,
      },
    },
  })
);
