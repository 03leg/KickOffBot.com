import { makeStyles } from "tss-react/mui";

const maxHeightSettings = "302px";

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
    maxWidth: "40%",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    maxHeight: maxHeightSettings,
  },
  cardSettingsContainer: {
    flex: 1,
    backgroundColor: "white",
    marginLeft: spacing(1),
    padding: spacing(1),
    maxHeight: maxHeightSettings,
    overflowY: "auto",
  },
  textEditor: {
    height: "70%",
  },
  img: {
    width: "100%",
    height: "calc(100% - 41px)",
    objectFit: "contain",
    marginTop: spacing(1),
  },
  titleContainer: {
    padding: spacing(1),
    marginBottom: spacing(1),
    backgroundColor: "white",
  },
  visibilityContainer: {
    marginTop: spacing(1),
  },
}));
