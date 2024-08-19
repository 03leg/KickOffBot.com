import { makeStyles } from "tss-react/mui";

export const useWebNumberInputStyles = makeStyles()(({ spacing }) => ({
  editor: {
    marginTop: spacing(1),
    marginBottom: spacing(2),
  },
}));
