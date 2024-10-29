import { makeStyles } from "tss-react/mui";

export const useWebRatingEditorStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  editor: {
    marginTop: spacing(1),
    marginBottom: spacing(2),
  },
  eachOptionLabels: {
    marginTop: spacing(1),
    marginLeft: spacing(4),
  },
  selector: {
    marginTop: spacing(2),
  },
}));
