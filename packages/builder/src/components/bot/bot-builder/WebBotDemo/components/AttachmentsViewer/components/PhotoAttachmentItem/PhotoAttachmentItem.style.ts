import { makeStyles } from "tss-react/mui";

export const usePhotoAttachmentItemStyles = makeStyles()((theme) => ({
  img: {
    height: "100%",
    width: "100%",
    borderRadius: theme.shape.borderRadius,
    objectFit: "cover",
  },
}));
