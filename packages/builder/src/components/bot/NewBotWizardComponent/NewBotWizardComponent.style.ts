import { makeStyles } from "tss-react/mui";

export const useNewBotWizardComponentStyles = makeStyles()(({ spacing }) => ({
  step1Root: {
    display: "flex",
    flexDirection: "row",
    padding: spacing(1, 0),
  },
  step1ButtonPlatformContent: {
    padding: spacing(5),
    textTransform: "none",
    display: "flex",
    fontSize: '1.6rem',
    alignItems: "center",
    "& svg": { marginRight: spacing(1) },
  },
  step1ButtonPlatform: {
    marginRight: spacing(1),
    marginLeft: spacing(1),
    width: "50%",
  },
  step2Root: {
    display: "flex",
    flexDirection: "column",
  },
  step2Button: {
    textTransform: "none",
  },
  step2ButtonContent: {
    display: "flex",
    flexDirection: "column",
  },
  step3Root: {
    display: "flex",
    flexDirection: "column",
  },
  step4Root: {
    display: "flex",
    justifyContent: "center",
    padding: spacing(2),
  },
}));
