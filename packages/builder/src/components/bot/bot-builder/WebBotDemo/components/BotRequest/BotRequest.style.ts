import { makeStyles } from "tss-react/mui";

export const useBotRequestStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: spacing(1),
    marginRight: spacing(1),
    marginBottom: spacing(1),
  },
}));
