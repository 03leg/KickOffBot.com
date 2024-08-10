import { ConnectionDescription, ConnectionType, TelegramConnectionDescription } from '@kickoffbot.com/types';
import { Box, Button, TextField } from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import AppDialog from '~/components/commons/Dialog/AppDialog';
import { TelegramConnectionEditor } from './TelegramConnectionEditor';
import { v4 } from 'uuid';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';

interface Props {
    show: boolean;
    connectionType: ConnectionType;
    connectionId?: ConnectionDescription['id']
    onClose: () => void;
}

function getDialogTitle(isEditMode: boolean, connectionType: ConnectionType) {
    switch (connectionType) {
        case ConnectionType.Telegram:
            return (isEditMode ? "Edit" : "Create") + ' Telegram connection';
    }

    return 'Connection';
}

function getDefaultConnectionName(connectionType: ConnectionType, connections: ConnectionDescription[]) {
    let index = 1;
    do {
        let name = "";

        switch (connectionType) {
            case ConnectionType.Telegram:
                name = `Telegram connection #${index}`;
                break;
            default:
                throw new Error("InvalidOperationError");
        }

        if (connections.findIndex(c => c.name === name) === -1) {
            return name
        }
        index++;
    } while (true);
}

export const ConnectionEditor = ({ show, onClose, connectionType, connectionId }: Props) => {
    const { saveConnection, connections } = useFlowDesignerStore((state) => ({
        saveConnection: state.saveConnection,
        connections: (state.project.connections ?? []).filter(c => c.type === connectionType),
    }));
    const [connectionDescription, setConnectionDescription] = React.useState<ConnectionDescription>(connectionId ? connections.find(c => c.id === connectionId)! : {
        id: v4(),
        name: getDefaultConnectionName(connectionType, connections),
        type: connectionType
    } as ConnectionDescription);

    const telegramConnection = connectionDescription as TelegramConnectionDescription;

    const handleConnectionNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConnectionDescription({ ...connectionDescription, name: event.target.value });
    }

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleSave = useCallback(() => {
        saveConnection(connectionDescription);
        onClose();
    }, [connectionDescription, onClose, saveConnection]);

    const isEditMode = useMemo(() => connectionId !== undefined, [connectionId]);

    const disabledConfirmationButton = useMemo(() => {
        if (connectionDescription.name === '' || connections.find(c => c.name === connectionDescription.name && c.id !== connectionDescription.id)) {
            return true
        }

        if (connectionType === ConnectionType.Telegram) {
            return telegramConnection.botToken === '' || telegramConnection.targetChatId === '' || telegramConnection.botToken === undefined || telegramConnection.targetChatId === undefined;
        }

        return true;
    }, [connectionDescription.id, connectionDescription.name, connectionType, connections, telegramConnection.botToken, telegramConnection.targetChatId])

    if (!show) {
        return null;
    }


    return (
        <AppDialog
            onClose={handleClose}
            maxWidth={'sm'}
            buttons={[
                <Button key={'save'} onClick={handleSave} variant='contained' color='success' disabled={disabledConfirmationButton}>Save</Button>,
                <Button key={'close'} onClick={handleClose}>Close</Button>
            ]}
            open={true} title={getDialogTitle(isEditMode, connectionType)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: (theme) => theme.spacing(1, 0) }}>
                <TextField sx={{ mb: 2 }} fullWidth variant="outlined" required label="Connection name" value={connectionDescription.name} onChange={handleConnectionNameChange} />
                {
                    connectionType === ConnectionType.Telegram && <TelegramConnectionEditor
                        botToken={telegramConnection.botToken}
                        chatId={telegramConnection.targetChatId}
                        onBotTokenChange={function (botToken: string): void {
                            setConnectionDescription({ ...telegramConnection, botToken } as TelegramConnectionDescription);
                        }} onChatIdChange={function (targetChatId: string): void {
                            setConnectionDescription({ ...telegramConnection, targetChatId } as TelegramConnectionDescription);
                        }} />
                }
            </Box>
        </AppDialog>
    )
}
