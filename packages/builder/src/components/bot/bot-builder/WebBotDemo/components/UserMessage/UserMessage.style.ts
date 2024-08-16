import { makeStyles } from "tss-react/mui";

export const useUserMessageStyles = makeStyles()(({ spacing, shape }) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-end",
    maxWidth: "calc(100% - 74px)",
    marginTop: spacing(1),
    marginRight: spacing(1),
    "& p": {
      margin: 0,
    },
  },
  message: {
    padding: spacing(1, 2),
    borderRadius: shape.borderRadius,
    backgroundColor: "#ebebeb",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minWidth: 0,
  },
  text: {},
}));
