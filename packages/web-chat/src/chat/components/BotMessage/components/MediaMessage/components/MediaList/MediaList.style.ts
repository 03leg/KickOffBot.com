import { makeStyles } from "tss-react/mui";

export const useMediaListStyles = makeStyles<{ wrapped: boolean, direction: 'row' | 'column' }>()(
  ({ spacing }, options) => ({
    root: {
      display: "flex",
      flexDirection: options.direction,
      overflow: options.wrapped ? undefined : "auto",
      flexWrap: options.wrapped ? "wrap" : undefined,
    },
  })
);
