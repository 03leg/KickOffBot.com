import { makeStyles } from "tss-react/mui";

export const useUnsplashAuthorBoxStyles = makeStyles()(({ spacing }) => ({
  unsplashImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: spacing(0.5),
    "& a": { color: "white" },
  },
}));