import { makeStyles } from "tss-react/mui";

export const useCard1Styles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxWidth: "250px",

    "& p": {
      margin: 0,
    },
  },
  img: {
    width: "100%",
    height: "auto",
    objectFit: "contain",
  },
}));
