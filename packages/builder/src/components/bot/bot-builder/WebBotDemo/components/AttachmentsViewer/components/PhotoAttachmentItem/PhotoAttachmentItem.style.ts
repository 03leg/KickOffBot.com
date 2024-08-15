import { makeStyles } from "tss-react/mui";
import { Colors } from "~/themes/Colors";

export const usePhotoAttachmentItemStyles = makeStyles()((theme) => ({
  img: {
    height: "100%",
    width: "100%",
    borderRadius: theme.shape.borderRadius,
    objectFit: "cover",
  },
  action: {
    backgroundColor: Colors.WHITE,
    "& :hover": {
    },
  },
}));
