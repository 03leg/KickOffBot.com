import { alpha } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useDateTimeBoxRequestStyles = makeStyles()(
  ({ spacing, breakpoints, palette }) => ({
    root: {
      display: "flex",
      alignItems: "center",
      [breakpoints.down("sm")]: {
        width: "calc(100% - 66px)",
      },
    },
    textField: {
      flex: 1,
      marginRight: spacing(1),
    },
    picker: {
      width: "100%",
      "& .MuiIconButton-root:hover": {
        backgroundColor: alpha(palette.primary.main, palette.action.hoverOpacity),
      },
    },
  })
);
