import { makeStyles } from "tss-react/mui";

export const useSettingsGroupStyles = makeStyles()(({ spacing }) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginTop: spacing(3),
  },
}));
