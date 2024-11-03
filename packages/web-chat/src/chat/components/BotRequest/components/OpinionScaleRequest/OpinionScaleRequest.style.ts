import { makeStyles } from "tss-react/mui";

export const useOpinionScaleRequestStyles = makeStyles()(
  ({ spacing, breakpoints }) => ({
    root: {
      display: "flex",
      alignItems: "center",
    },
  })
);
