import { makeStyles } from "tss-react/mui";

export const useButtonsBoxRequestStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    maxWidth: "90%",
    flexWrap: "wrap",
    justifyContent: "flex-end"
  },
  button: {
    margin: spacing(0, 1, 1, 0),
  },
}));
