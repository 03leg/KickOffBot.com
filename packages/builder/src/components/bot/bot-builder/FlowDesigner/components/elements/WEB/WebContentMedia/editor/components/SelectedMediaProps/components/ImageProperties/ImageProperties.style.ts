import { makeStyles } from "tss-react/mui";

export const useImagePropertiesStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  editorField: {
    marginTop: spacing(1.5),
  },
}));
