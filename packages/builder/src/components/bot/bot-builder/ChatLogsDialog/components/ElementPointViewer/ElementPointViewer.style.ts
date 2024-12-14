import { makeStyles } from "tss-react/mui";

export const useElementPointViewerStyles = makeStyles()(
  ({ spacing, palette }) => ({
    root: {
      display: "flex",
    },
    blockTitle: {
      //   marginLeft: spacing(1),
      padding: spacing(0, 1),
      borderRadius: spacing(1),
    },
    elementType: {
      marginLeft: spacing(1),
      padding: spacing(0, 1),
      borderRadius: spacing(1),
    },
    elementIndex: {
      marginLeft: spacing(1),
      padding: spacing(0, 1),
      borderRadius: spacing(1),
      backgroundColor: "hsl(48, 100%, 80%)",
    },
  })
);
