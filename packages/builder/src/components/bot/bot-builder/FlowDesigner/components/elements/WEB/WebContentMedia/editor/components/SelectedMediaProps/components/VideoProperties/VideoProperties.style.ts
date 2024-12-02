import { makeStyles } from "tss-react/mui";

export const useVideoPropertiesStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  videoPreview: {
    padding: spacing(1),
    width: "50%",
  },
  propsContainer: {
    width: "50%",
    padding: spacing(1),
  },
  editorField: {
    marginTop: spacing(1.5),
  },
  notVideoBox: {
    textAlign: "center",
  },
}));
