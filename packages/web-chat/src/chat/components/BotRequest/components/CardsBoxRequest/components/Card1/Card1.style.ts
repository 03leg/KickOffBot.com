import { makeStyles } from "tss-react/mui";

export const useCard1Styles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxWidth: "250px",
    width: "max-content",

    "& p": {
      margin: 0,
    },
  },
  img: {
    width: "100%",
    height: "auto",
    objectFit: "contain",
    boxSizing: "border-box",
  },
  unsplashImageContainer: {
    position: "absolute",
    bottom: 6,
    left: 0,
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: spacing(0.5),
    "& a": { color: "white" },
  },
}));
