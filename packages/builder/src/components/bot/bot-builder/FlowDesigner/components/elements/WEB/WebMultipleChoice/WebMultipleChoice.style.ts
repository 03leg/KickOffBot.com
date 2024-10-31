import { makeStyles } from "tss-react/mui";

export const useWebMultipleChoiceStyles = makeStyles()(({ spacing }) => ({
  options: {
    backgroundColor: "#CDDC39",
    padding: spacing(0, 0.5),
  },
}));
