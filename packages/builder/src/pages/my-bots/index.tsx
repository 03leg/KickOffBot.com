import * as React from 'react';
import Layout from '../Layout';
import { Box, Stack } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { SettingsWindow } from '~/components/bot/SettingsWindow';
import { api } from '~/utils/api';
import { BotDescriptionCard } from '~/components/bot/BotDescriptionCard';
import { type BotDescription } from '~/types/Bot';
import { useRouter } from 'next/router';
import { EDIT_BOT_PATH } from '~/constants';
import { useRedirectUnauthorizedUser } from '~/utils/useRedirectUnauthorizedUser';
import { LoadingIndicator } from '~/components/commons/LoadingIndicator';
import { ConfirmProvider } from 'material-ui-confirm';

export default function CreatePage() {
    const { data: bots = [], refetch, isLoading } = api.botManagement.getAll.useQuery();
    const router = useRouter();

    const { mutateAsync } = api.botManagement.removeBot.useMutation();
    useRedirectUnauthorizedUser();

    const handleEdit = React.useCallback((botDescription: BotDescription) => {
        void router.push(EDIT_BOT_PATH + botDescription.id);
    }, [router]);

    const handleRemove = React.useCallback(async (botDescription: BotDescription) => {
        await mutateAsync(botDescription);
        void refetch();
    }, [mutateAsync, refetch]);

    return (
        <ConfirmProvider>
            <Layout>
                <Box sx={{ padding: (theme) => theme.spacing(2), height: '100%', display: 'flex', flexDirection: 'column', }}>
                    <SnackbarProvider />
                    {isLoading && <LoadingIndicator />}
                    {!isLoading && bots.length > 0 && <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h1>My bots</h1>
                            <SettingsWindow onUpdate={refetch} botNames={bots.map((botDescription) => botDescription.name)} />
                        </Box>
                        <Stack direction="row" spacing={2} padding={({ spacing }) => spacing(1, 0, 1, 0)} flexWrap="wrap" useFlexGap={true} overflow={'auto'}>
                            {bots.map((botDescription) => (<BotDescriptionCard description={botDescription} key={botDescription.id} onEdit={handleEdit} onRemove={handleRemove} />))}
                        </Stack>
                    </>
                    }
                    {!isLoading && bots.length === 0 && <>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <SettingsWindow onUpdate={refetch} buttonText='Create your first bot' />
                        </Box>
                    </>
                    }
                </Box>
            </Layout>
        </ConfirmProvider>
    );
}