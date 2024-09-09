import { makeStyles } from "tss-react/mui";

export const useItemsListEditorStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    flex: 1,
    backgroundColor: "#F3F6F9",
    height: "300px",
    padding: 1,
  },
}));
