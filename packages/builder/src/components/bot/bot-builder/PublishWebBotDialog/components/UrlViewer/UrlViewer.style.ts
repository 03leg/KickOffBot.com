import { makeStyles } from "tss-react/mui";

export const useUrlViewerStyles = makeStyles()(({ spacing }) => ({
  link: {
    display: "flex",
    marginTop: spacing(1),
  },
  actionButton: {
    marginLeft: spacing(0.5),
  },
  buttonContainer: {
    display: "flex",
  },
}));
