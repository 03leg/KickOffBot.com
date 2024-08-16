import { keyframes } from "tss-react";
import { makeStyles } from "tss-react/mui";

const showMessage = keyframes({
  "100%": {
    opacity: 1,
    transform: "none",
  },
});

export const useBotMessageStyles = makeStyles<
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
    // animation: `${showMessage} 600ms 100ms cubic-bezier(0.38, 0.97, 0.56, 0.76) forwards`,
    // opacity: 0,
    // transform: "rotateX(-90deg)",
    // transformOrigin: "top left bottom right",
  },
  text: {
    marginBottom: options?.hasAttachments ? spacing(1) : undefined,
  },
}));
