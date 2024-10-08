import { makeStyles } from "tss-react/mui";
import { Colors } from "~/themes/Colors";

export const useVideoMediaStyles = makeStyles()((theme) => ({
  root: {
    marginRight: theme.spacing(1),
    padding: theme.spacing(0.2),
  },
  videoRoot: {
    height: 120,
    width: 200,
    flex: "none",
    position: "relative",
    backgroundColor: "black",
    cursor: "pointer",
  },
  action: {
    backgroundColor: Colors.WHITE,
    "& :hover": {},
    position: "absolute",
    right: 5,
    top: 10,
  },
  selected: {
    border: `3px solid ${Colors.SELECTED}`,
    borderRadius: theme.shape.borderRadius,
    // padding: theme.spacing(0.4),
  },
}));
