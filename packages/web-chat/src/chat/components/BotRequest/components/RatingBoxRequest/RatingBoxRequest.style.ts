import { makeStyles } from "tss-react/mui";

export const useRatingBoxRequestStyles = makeStyles()(
  ({ spacing, breakpoints }) => ({
    root: {
      padding: spacing(0, 0, 0, 1),
    },
    ratingBox: {
      display: "flex",
      justifyContent: "end",
      alignItems: "center",
    },
  })
);
