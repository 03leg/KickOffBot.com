import { makeStyles } from "tss-react/mui";

export const useLogViewerStyles = makeStyles()(({ spacing, palette }) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  logItem: {
    display: "flex",
    marginBottom: "1px",
    "&:hover": {
      backgroundColor: palette.action.hover,
    },
  },
  time: {
    marginRight: spacing(1),
  },
  message: {
    textWrap: "nowrap",
    marginRight: spacing(1),
  },
}));
