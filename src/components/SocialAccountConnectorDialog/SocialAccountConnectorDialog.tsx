import * as React from 'react';
import SmhDialog from '../commons/Dialog/SmhDialog';
import { Box, Button, FormControlLabel, Link, Switch, TextField } from '@mui/material';
import { api } from '~/utils/api';
import { LoadingIndicator } from '../commons/LoadingIndicator';
import { type SocialMediaAccount } from '~/types/SocialMediaAccount';

interface SocialAccountConnectorDialogProps {
    onClose: (success?: boolean) => void;
    open: boolean;
    socialMedia: SocialMediaAccount;
}

export default function SocialAccountConnectorDialog({ open, onClose }: SocialAccountConnectorDialogProps) {
    const [urlValue, setUrlValue] = React.useState<string>("https://t.me/eng4me_Oo");
    const [addBotFlag, setAddBotFlag] = React.useState<boolean>(false);

    const { mutateAsync } = api.telegram.checkChannel.useMutation();
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleConnectNewAccount = React.useCallback(async () => {
        if (urlValue.includes("t.me/") && addBotFlag) {
            setLoading(true);

            const mutateResult = await mutateAsync({ telegramUrl: urlValue });

            if (mutateResult) {
                onClose(true);
            }

            setLoading(false);
        }
    }, [addBotFlag, mutateAsync, onClose, urlValue]);

    const handleValueChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUrlValue(event.target.value);
    }, [])

    const handleAddBotFlag = React.useCallback((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setAddBotFlag(checked)
    }, [])

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <SmhDialog
            onClose={onClose}
            buttons={[
                <Button key={'Add'} autoFocus onClick={() => void handleConnectNewAccount()} variant='contained' color='success'>
                    Add
                </Button>,
                <Button key={'Cancel'} onClick={() => onClose()}>
                    Cancel
                </Button>
            ]}
            open={open} title={'Add telegram'}>
            <Box sx={{ padding: (theme) => theme.spacing(2) }}>
                <TextField
                    sx={{ width: '100%', marginBottom: (theme) => theme.spacing(2) }}
                    required
                    label="Telegram Group or Channel"
                    placeholder="https://t.me/YOUR-ACCOUNT"
                    value={urlValue}
                    onChange={handleValueChange}
                />
                <FormControlLabel control={<Switch value={addBotFlag} onChange={handleAddBotFlag} />} label={<>I confirm that I have added <Link>@SMMotherBot</Link> as an admin</>} />
            </Box>
        </SmhDialog>
    );
}
