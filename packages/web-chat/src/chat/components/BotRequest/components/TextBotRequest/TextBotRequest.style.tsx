import { makeStyles } from "tss-react/mui";

export const useTextBoxRequestStyles = makeStyles()(({ spacing, breakpoints }) => ({
    root: {
        display: "flex",
        alignItems: "center",
        width: '50%',
        [breakpoints.down("md")]: {
            width: "70%",
        },
        [breakpoints.down("sm")]: {
            width: "calc(100% - 66px)",
        },
    },
    textField: {
        flex: 1,
        marginRight: spacing(1)
    }
}));
