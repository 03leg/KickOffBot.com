import { useCallback, useContext, useEffect, useMemo } from "react";
import AppDialogContext from "./AppDialogContext";
import { DialogOptions } from "./types";

let appDialogId = 0;

const useGetAppDialogId = () => {
  const id = useMemo(() => {
    return appDialogId++;
  }, []);

  return `app-dialog-${id}`;
};

export const useAppDialog = () => {
  const parentId = useGetAppDialogId();
  const { openDialog, closeDialog } = useContext(AppDialogContext);

  const openDialogWithParent = useCallback(
    (options: DialogOptions) => {
      return openDialog(parentId, options);
    },
    [openDialog, parentId]
  );

  const closeDialogByParentId = useCallback(() => {
    closeDialog(parentId);
  }, [closeDialog, parentId]);

  useEffect(() => {
    return () => {
      closeDialogByParentId();
    };
  }, [closeDialogByParentId, parentId]);

  return { openDialog: openDialogWithParent, closeDialog: closeDialogByParentId };
};
