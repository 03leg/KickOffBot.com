import { makeStyles } from "tss-react/mui";

export const useWebContentMediaEditorStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  toolbar: {
    display: "flex",
  },
  toolbarButton: {
    marginRight: spacing(1),
    textTransform: "none",
  },
  mediasViewer: {},
  selectedMediaProps: {
    display: "flex",
    flexDirection: "column",
  },
}));
