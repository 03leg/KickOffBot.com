import React, { useCallback, useEffect, useState } from 'react'
import { useFlowDesignerStore } from '../store';
import SmhDialog from '~/components/commons/Dialog/SmhDialog';
import { Box, Button } from '@mui/material';
import { NewBotToken } from './NewBotToken';
import { api } from '~/utils/api';
import { TokensManager } from './TokensManager';
import { TelegramToken } from '@kickoffbot.com/types';

interface Props {
    projectId: string | undefined;
}

export const RuntimeEditor = ({ projectId }: Props) => {
    const { toggleRuntimeEditor, showRuntimeEditor } = useFlowDesignerStore((state) => ({
        toggleRuntimeEditor: state.toggleRuntimeEditor,
        showRuntimeEditor: state.showRuntimeEditor
    }));
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { mutateAsync: addTelegramToken } = api.botManagement.addTelegramToken.useMutation();
    const { mutateAsync: deleteTelegramToken } = api.botManagement.deleteTelegramToken.useMutation();
    const { mutateAsync: startBot } = api.botManagement.startBot.useMutation();
    const { mutateAsync: stopBot } = api.botManagement.stopBot.useMutation();
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const { data = [], refetch } = api.botManagement.getTelegramTokens.useQuery({ projectId: projectId! }, { enabled: projectId !== undefined && showRuntimeEditor });

    const handleClose = useCallback(() => {
        toggleRuntimeEditor();
    }, [toggleRuntimeEditor]);

    useEffect(() => {
        if (showRuntimeEditor) {
            void refetch();
        }
    }, [refetch, showRuntimeEditor])

    const handleAddNewBotToken = useCallback(async (newBotToken: string) => {
        setErrorMessage(undefined);
        if (projectId === undefined) {
            return;
        }
        setIsLoading(true);

        try {
            await addTelegramToken({
                token: newBotToken,
                projectId
            });
            await refetch();
        }
        catch (e) {
            setErrorMessage('Failed to add bot token');
        }
        finally {
            setIsLoading(false);
        }

    }, [addTelegramToken, projectId, refetch]);

    const handleDeleteToken = useCallback(async (token: TelegramToken) => {
        if (projectId === undefined) {
            return;
        }
        setIsLoading(true);

        try {
            await deleteTelegramToken({
                tokenId: token.id,
                projectId
            });
            await refetch();
        }
        catch (e) {
            setErrorMessage('Failed to delete bot token');
        }
        finally {
            setIsLoading(false);
        }
    }, [deleteTelegramToken, projectId, refetch]);

    const startStopBot = useCallback(async (token: TelegramToken, start: boolean) => {
        if (projectId === undefined) {
            return;
        }
        setIsLoading(true);

        try {
            start ?
                await startBot({
                    tokenId: token.id,
                })
                :
                await stopBot({
                    tokenId: token.id,
                })
            await refetch();
        }
        catch (e) {
            setErrorMessage('Failed to start/stop bot token');
        }
        finally {
            setIsLoading(false);
        }
    }, [projectId, refetch, startBot, stopBot]);

    useEffect(() => {
        const tokensInProgress = data.filter((token) => token.requestActiveValue);

        if (tokensInProgress.length > 0) {
            setTimeout(() => {
                void refetch();
            }, 20 * 1000);
        }
    }, [data, refetch]);

    const handleStartBot = useCallback((token: TelegramToken) => {
        void startStopBot(token, true);
    }, [startStopBot]);

    const handleStopBot = useCallback((token: TelegramToken) => {
        void startStopBot(token, false);
    }, [startStopBot]);


    if (showRuntimeEditor === false) {
        return null;
    }

    return (
        <SmhDialog
            onClose={handleClose}
            maxWidth={'sm'}
            isLoading={isLoading}
            error={errorMessage}
            buttons={[
                <Button key={'close'} onClick={handleClose}>Close</Button>
            ]}
            open={true} title={'Runtime Editor'}>
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: (theme) => theme.spacing(1, 0) }}>
                <NewBotToken onAddNewBotToken={handleAddNewBotToken} />
                {data.length > 0 && <TokensManager
                    tokens={data}
                    onDelete={handleDeleteToken}
                    onStartBot={handleStartBot}
                    onStopBot={handleStopBot}

                />}
            </Box>
        </SmhDialog>
    )
}
