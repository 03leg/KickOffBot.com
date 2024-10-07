import { makeStyles } from "tss-react/mui";

export const useSelectedMediaPropsStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));
