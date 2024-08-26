import { makeStyles } from "tss-react/mui";

export const useWebLogicRemoveMessagesEditorStyles = makeStyles()(
  ({ spacing }) => ({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
    addNewMessage: {
      marginTop: spacing(1),
    },
    message: {
      marginTop: 1,
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    messageHeader: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    deleteButton: {
      marginLeft: spacing(1),
    },
  })
);
