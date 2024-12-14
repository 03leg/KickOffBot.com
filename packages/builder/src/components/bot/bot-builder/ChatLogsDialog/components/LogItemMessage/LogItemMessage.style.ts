import { makeStyles } from "tss-react/mui";

export const useLogItemMessageStyles = makeStyles()(({ spacing, palette }) => ({
  time: {
    marginRight: spacing(1),
  },
  message: {
    textWrap: "nowrap",
    marginRight: spacing(1),
  },
}));
