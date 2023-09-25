import { Box, Button, TextField } from '@mui/material'
import React, { useCallback } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { isEmpty } from 'lodash';
import { api } from '~/utils/api';
import SmhDialog from '~/components/commons/Dialog/SmhDialog';


interface Props {
    onUpdate?: VoidFunction;
}

export const SettingsWindow = ({ onUpdate }: Props) => {
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<unknown>();
    const [botName, setBotName] = React.useState<string>('');
    const { mutateAsync } = api.botManagement.saveBot.useMutation();

    const resetState = useCallback(() => {
        setError(undefined);
        setBotName('');
        setIsLoading(false);
    }, []);

    const handleClickOpen = useCallback(() => {
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
        resetState();
    }, [resetState]);

    const handleSave = useCallback(async () => {
        setIsLoading(true);

        try {
            await mutateAsync({ name: botName });
            handleClose();
            onUpdate?.();
        }
        catch (e) {
            setError(e);
        }
        finally {
            setIsLoading(false);
        }
    }, [botName, handleClose, mutateAsync, onUpdate]);


    const handleBotNameValueChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBotName(event.target.value);
    }, [])

    return (
        <>
            <Button startIcon={<AddIcon />} variant="outlined" onClick={handleClickOpen}>Add New Bot</Button>
            <SmhDialog
                isLoading={isLoading}
                onClose={handleClose}
                maxWidth={'sm'}
                error={error}
                buttons={[
                    <Button key={'save'} onClick={handleSave} variant='contained' color='success' disabled={isEmpty(botName)}>Save</Button>,
                    <Button key={'close'} onClick={handleClose}>Close</Button>
                ]}
                open={open} title={'Create New Bot'}>
                <Box sx={{ display: 'flex', padding: (theme) => theme.spacing(1, 0) }}>
                    <TextField
                        fullWidth
                        required
                        label="BOT name"
                        value={botName}
                        onChange={handleBotNameValueChange}
                    />
                </Box>
            </SmhDialog>
        </>

    )
}
