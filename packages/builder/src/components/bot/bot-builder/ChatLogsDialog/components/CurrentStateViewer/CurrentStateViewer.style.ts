import { makeStyles } from "tss-react/mui";

export const useCurrentStateViewerStyles = makeStyles()(
  ({ spacing, palette }) => ({
    root: {
      width: "100%",
    },
    selector: {
      marginBottom: spacing(2),
    },
  })
);
