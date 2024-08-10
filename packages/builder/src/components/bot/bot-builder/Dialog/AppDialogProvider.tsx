import { Fragment, useCallback, useState } from "react";
import AppDialogContext from "./AppDialogContext";
import AppDialog from "~/components/commons/Dialog/AppDialog";
import { DialogOptions } from "./types";

interface Props {
    children: JSX.Element
}

export const AppDialogProvider = ({ children }: Props) => {
    const [dialogs, setDialogs] = useState<{ parentId: string, options: DialogOptions }[]>([]);

    const openDialog = useCallback((dialogId: string, options: DialogOptions) => {
        if (dialogs.some(dialog => dialog.parentId === dialogId)) {
            throw new Error('InvalidOperationError');
        }
        setDialogs(prev => [...prev, { parentId: dialogId, options }]);

    }, [dialogs]);

    const closeDialog = useCallback((dialogId: string) => {
        setDialogs(prev => prev.filter(dialog => dialog.parentId !== dialogId));
    }, []);

    return (
        <Fragment>
            <AppDialogContext.Provider value={{ openDialog, closeDialog }}>
                {children}
            </AppDialogContext.Provider>
            {dialogs.map(({ parentId, options }) => (
                <AppDialog
                    key={parentId}
                    onClose={(even?: unknown, reason?: string) => {
                        if (reason && reason === "backdropClick")
                            return;

                        closeDialog(parentId);
                    }}
                    maxWidth={'sm'}
                    buttons={options.buttons ?? []}
                    open={true} title={options.title}>
                    {options.content}
                </AppDialog>
            ))}
        </Fragment>
    );
};