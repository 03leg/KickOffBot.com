import { makeStyles } from "tss-react/mui";

export const useWebEmailInputStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
}));
