import { makeStyles } from "tss-react/mui";

export const useAttachmentsViewerStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  img: {
    width: "100%",
    borderRadius: theme.shape.borderRadius,
    objectFit: "contain",
    marginBottom: theme.spacing(1),
  },
  file: {
    display: "flex",
    maxWidth: "100%",
    padding: theme.spacing(0, 0, 1, 0),
  },
  attachmentList: {
    display: "flex",
    alignItems: "flex-start",
    padding: theme.spacing(0, 0, 1, 0),
    overflow: "auto",
  },
}));
