import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()(() => ({
  root: {
    position: "absolute",
    touchAction: "none",
  },
  input: {
    position: "absolute",
  },
  commandBlockPort: {
    position: 'absolute',
    top: '70px',
    right: '-9px'
  },
  standardBlockPort: {
    position: 'absolute',
    bottom: '0px',
    right: '-9px'
  },
}));
