import { makeStyles } from "tss-react/mui";
import { Colors } from "~/themes/Colors";

export const useImageMediaStyles = makeStyles()((theme) => ({
  root: {
    height: 150,
    width: 150,
    marginRight: theme.spacing(1),
    flex: "none",
    position: "relative",
    padding: theme.spacing(0.2),
    cursor: "pointer",
  },
  img: {
    height: "100%",
    width: "100%",
    borderRadius: theme.shape.borderRadius,
    objectFit: "cover",
  },
  action: {
    backgroundColor: Colors.WHITE,
    "& :hover": {},
    position: "absolute",
    right: 5,
    top: 5,
  },
  selected: {
    border: `3px solid ${Colors.SELECTED}`,
    borderRadius: theme.shape.borderRadius,
  },
  notImageBox: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    textAlign: "center",
    border: `1px solid ${Colors.BORDER}`,
    borderRadius: theme.shape.borderRadius,
  },
}));
