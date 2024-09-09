import { makeStyles } from "tss-react/mui";

export const useCardDetailsViewStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  toolbar: {
    padding: spacing(1),
    display: "flex",
    backgroundColor: "white",
  },
  content: {
    // marginTop: spacing(1),
    display: "flex",
    flex: 1,
    maxHeight: "100%",
  },
  imagePreview: {
    padding: spacing(1),
    // height: "100%",
    maxWidth: "40%",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
  },
  textEditor: {
    flex: 1,
    backgroundColor: "white",
    marginLeft: spacing(1),
    padding: spacing(1),
  },
  img: {
    width: "100%",
    height: "calc(100% - 37px)",
    objectFit: "contain",
  },
}));
