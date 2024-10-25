import { makeStyles } from "tss-react/mui";

export const useThemeCardStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    margin: spacing(1, 1, 0, 0),
    width: 180,
  },
  title: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  selectedCard: {
    boxShadow:
      "0px 2px 1px -1px #2e7d32, 0px 1px 1px 0px #2e7d32, 0px 1px 3px 0px #2e7d32",
  },
}));
