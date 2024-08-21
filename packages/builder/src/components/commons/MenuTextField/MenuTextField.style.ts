import { makeStyles } from "tss-react/mui";

export const useMenuTextFieldStyles = makeStyles()(({ spacing }) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  menuButton: {
    marginLeft: 1,
  },
}));
