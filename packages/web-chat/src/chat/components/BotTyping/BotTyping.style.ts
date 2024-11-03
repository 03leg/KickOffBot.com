import { makeStyles } from "tss-react/mui";

export const useBotTypingStyles = makeStyles<
  { hasAttachments: boolean } | undefined
>()(({ spacing, shape, palette }, options) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    maxWidth: "90%",
    marginTop: spacing(1),
    
    "& p": {
      margin: 0,
    },
  },
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
    minHeight: 40,
  },
  text: {
    marginBottom: options?.hasAttachments ? spacing(1) : undefined,
  },
}));
