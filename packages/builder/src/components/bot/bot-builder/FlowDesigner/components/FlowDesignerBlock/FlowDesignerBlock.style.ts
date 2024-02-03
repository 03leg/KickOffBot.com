import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()(() => ({
  root: {
    position: "absolute",
    touchAction: "none",
  },
  input: {
    position: "absolute",
  },
  blockPort: {
    position: 'absolute',
    top: '70px',
    right: '-9px'
  },
}));
