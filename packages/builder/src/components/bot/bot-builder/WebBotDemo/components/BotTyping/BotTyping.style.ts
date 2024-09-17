import { makeStyles } from "tss-react/mui";

export const useBotTypingStyles = makeStyles<
  { hasAttachments: boolean } | undefined
>()(({ spacing, shape }, options) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    maxWidth: "90%",
    marginTop: spacing(1),
    "& p": {
      margin: 0,
    },
  },
  avatar: {
    margin: spacing(0, 1, 1, 1),
  },
  message: {
    padding: spacing(1, 2),
    borderRadius: shape.borderRadius,
    backgroundColor: "#1976d2",
    color: "white",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minWidth: 0,
  },
  text: {
    marginBottom: options?.hasAttachments ? spacing(1) : undefined,
  },
}));
