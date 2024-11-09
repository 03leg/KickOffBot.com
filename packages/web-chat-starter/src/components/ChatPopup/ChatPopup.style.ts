import { alpha } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useChatPopupStyles = makeStyles()(({ spacing, palette, breakpoints }) => ({
  root: {
    backgroundColor: alpha("#000", 0.5),
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
  },
  popup: {
    height: "99vh",
    width: "900px",
    [breakpoints.down(900)]: {
      width: "calc(100% - 50px)",
    },
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: spacing(1),
  },
  content: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "white",
    marginBottom: spacing(1),
  },
  closeButton: {
    color: palette.grey[500],
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "#e9e9e9",
    },
  },
}));
