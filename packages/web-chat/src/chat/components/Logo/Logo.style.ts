import { makeStyles } from "tss-react/mui";

export const useLogoStyles = makeStyles()(({ spacing, palette }) => ({
  root: {
    width: "100%",
  },
  container: {
    height: "50px",
  },
  logo: {
    position: "absolute",
    textAlign: "center",
    bottom: "10px",
    color: palette.userMessage.contrastText,
    backgroundColor: palette.userMessage.main,
    paddingLeft: spacing(1),
    paddingRight: spacing(1),
    right: spacing(1),
    borderRadius: "5px",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    fontWeight: "bold",
  },
}));
