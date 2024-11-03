import { makeStyles } from "tss-react/mui";

export const useFileAttachmentItemStyles = makeStyles()(
  ({ spacing, shape, palette }) => ({
    root: {
      display: "flex",
      alignItems: "center",
      padding: spacing(1),
      borderRadius: shape.borderRadius,
      border: `1px solid ${palette.botMessage.contrastText}`,
      marginRight: spacing(1),
      cursor: "pointer",
      "&:last-child": {
        marginRight: 1,
      },
    },
  })
);
