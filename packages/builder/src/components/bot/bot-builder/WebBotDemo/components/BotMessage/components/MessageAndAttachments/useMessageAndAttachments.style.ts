import { makeStyles } from "tss-react/mui";

export const useMessageAndAttachmentsStyles = makeStyles<
  { hasAttachments: boolean } | undefined
>()(({ spacing, shape, palette }, options) => ({
  message: {
    padding: spacing(1, 2),
    borderRadius: shape.borderRadius,
    backgroundColor: palette.botMessage.main,
    color: palette.botMessage.contrastText,
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minWidth: 0,
  },
  text: {
    marginBottom: options?.hasAttachments ? spacing(1) : undefined,
    overflowWrap: "break-word"
  },
}));
