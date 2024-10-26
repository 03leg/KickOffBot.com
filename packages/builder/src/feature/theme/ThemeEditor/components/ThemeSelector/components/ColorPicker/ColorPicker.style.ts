import { makeStyles } from "tss-react/mui";

export const useColorPickerStyles = makeStyles()(({ spacing, shape }) => ({
  root: {
    height: "32px",
    width: "32px",
    position: "relative",
    borderRadius: shape.borderRadius,
    marginRight: spacing(1),
    cursor: "pointer",
  },
}));
