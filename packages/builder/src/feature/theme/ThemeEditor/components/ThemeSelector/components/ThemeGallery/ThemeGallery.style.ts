import { makeStyles } from "tss-react/mui";
import { Colors } from "~/themes/Colors";

export const useThemeGalleryStyles = makeStyles()(({ spacing }) => ({
  root: {
    backgroundColor: "white",
    border: `1px solid ${Colors.BORDER}`,
    padding: spacing(1),
    borderRadius: spacing(1),
    width: "100%",
    height: "100%",
    overflow: "auto",
  },
  toolbar: {
    display: "flex",
    justifyContent: "end",
  },
  header: {
    marginTop: spacing(1.5),
  },
  themes: {
    padding: spacing(1, 0),
    display: "flex",
    flexWrap: "wrap",
  },
}));
