import { makeStyles } from "tss-react/mui";

export const useSingleMediaViewStyles = makeStyles()(({ spacing, shape }) => ({
  root: {
    height: 200,
    display: "flex",
    justifyContent: "center",
  },
  img: {
    height: "100%",
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
