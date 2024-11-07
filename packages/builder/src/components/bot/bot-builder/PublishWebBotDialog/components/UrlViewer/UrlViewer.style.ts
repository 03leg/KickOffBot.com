import { makeStyles } from "tss-react/mui";

export const useUrlViewerStyles = makeStyles()(({ spacing }) => ({
  link: {
    display: "flex",
    marginTop: spacing(1),
  },
  copyButton: {
    marginLeft: spacing(0.5),
  },
}));
