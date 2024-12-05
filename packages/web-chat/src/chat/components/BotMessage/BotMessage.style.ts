import { makeStyles } from "tss-react/mui";

export const useBotMessageStyles = makeStyles()(({ spacing, palette }) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    maxWidth: "90%",
    marginTop: spacing(1),
    "& p": {
      margin: 0,
    },
    "& a": {
      color: palette.botMessage.contrastText,
    },
  },
  noAvatar: {
    width: spacing(2),
  },
}));
