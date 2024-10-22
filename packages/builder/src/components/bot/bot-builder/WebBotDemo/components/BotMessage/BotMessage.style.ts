import { makeStyles } from "tss-react/mui";

export const useBotMessageStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    maxWidth: "90%",
    marginTop: spacing(1),
    "& p": {
      margin: 0,
    },
  },
}));
