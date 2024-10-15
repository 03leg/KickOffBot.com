import { makeStyles } from "tss-react/mui";

export const useSingleMediaViewStyles = makeStyles()(({ spacing, shape }) => ({
  root: {
    // marginTop: 5,
  },
  img: {
    width: "100%",
    borderRadius: shape.borderRadius,
    objectFit: "contain",
  },
  notImageBox: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    textAlign: "center",
  },
}));
