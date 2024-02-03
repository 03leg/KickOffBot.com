import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()(() => ({
  root: {
    overflow: "hidden",
    touchAction: "none",
    display: "flex",
    height: "100%",
    width: "100%",
    backgroundImage: "radial-gradient(#dadada 1px, #fff 1px)",
    backgroundSize: "20px 20px",
    position: 'relative',
  },
  viewPort: {
    transformOrigin: '0px 0px',
  },
  svgViewPort:{
    height: '100%',
    width: '100%',
    pointerEvents: 'none',
    transformOrigin: '0px 0px',
    position: 'absolute'
  }
}));
