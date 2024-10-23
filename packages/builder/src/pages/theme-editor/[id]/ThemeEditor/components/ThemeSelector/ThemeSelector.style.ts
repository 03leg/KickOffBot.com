import { makeStyles } from "tss-react/mui";
import { Colors } from "~/themes/Colors";

export const useThemeSelectorStyles = makeStyles()(({ spacing }) => ({
  root: {
    backgroundColor: 'white',
    border: `1px solid ${Colors.BORDER}`,
    padding: spacing(1),
    borderRadius: spacing(1),
    width: '100%',
    height: '100%',
    overflow: 'auto',
  },
}));
