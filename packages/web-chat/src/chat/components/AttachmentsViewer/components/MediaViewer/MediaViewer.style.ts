import { makeStyles } from "tss-react/mui";

export const useMediaViewerStyles = makeStyles()((theme) => ({
  img: {
    width: "100%",
    borderRadius: theme.shape.borderRadius,
    objectFit: "contain",
    marginBottom: theme.spacing(1),
    "&:last-child": {
      marginBottom: 0,
    },
  },
}));
