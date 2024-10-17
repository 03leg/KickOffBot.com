import { makeStyles } from "tss-react/mui";

export const useUserMessageStyles = makeStyles()(({ spacing, shape, palette }) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-end",
    maxWidth: "calc(100% - 74px)",
    marginTop: spacing(1),
    marginRight: spacing(1),
    "& p": {
      margin: 0,
    },
  },
  message: {
    padding: spacing(1, 2),
    borderRadius: shape.borderRadius,
    backgroundColor: palette.userMessage.main,
    color: palette.userMessage.contrastText,
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minWidth: 0,
  },
  text: {},
}));
