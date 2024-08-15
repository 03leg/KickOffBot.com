import { makeStyles } from "tss-react/mui";

const diameter = 50 as const;

export const useBotAvatarStyles = makeStyles()(() => ({
  root: {
    height: diameter,
    width: diameter,
    backgroundColor: "#bbb",
    borderRadius: "50%",
  },
}));
