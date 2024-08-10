import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useCallback, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { isEmpty } from 'lodash';
import { api } from '~/utils/api';
import AppDialog from '~/components/commons/Dialog/AppDialog';
import { TemplatesViewer } from './TemplatesViewer';
import { useRouter } from 'next/router';
import { EDIT_BOT_PATH } from '~/constants';
import { TemplateDescription } from './types';


interface Props {
    onUpdate?: VoidFunction;
    buttonText?: string;
}

const DEFAULT_BOT_NAME = 'My Bot #1';

export const SettingsWindow = ({ onUpdate, buttonText = 'Create New Bot' }: Props) => {
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string>();
    const [botName, setBotName] = React.useState<string>(DEFAULT_BOT_NAME);
    const { mutateAsync } = api.botManagement.saveBot.useMutation();
    const [botTemplate, setBotTemplate] = useState<TemplateDescription | undefined>();
    const router = useRouter();


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
            const newBotId: string = await mutateAsync({ name: botName, template: botTemplate?.template });

            handleClose();

            void router.push(EDIT_BOT_PATH + newBotId);
        }
        catch (e) {
            setError('Failed to create bot');
        }
        finally {
            setIsLoading(false);
        }
    }, [botName, botTemplate, handleClose, mutateAsync, router]);


    const handleBotNameValueChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBotName(event.target.value);
    }, []);

    const handleTemplateChange = useCallback((template: TemplateDescription) => {
        setBotTemplate(template);
        setBotName(template.template ? template.title : DEFAULT_BOT_NAME);
    }, []);

    return (
        <>
            <Button startIcon={<AddIcon />} variant="contained" color='success' onClick={handleClickOpen}>{buttonText}</Button>
            <AppDialog
                isLoading={isLoading}
                onClose={handleClose}
                maxWidth={'lg'}
                error={error}
                buttons={[
                    <Button key={'save'} onClick={handleSave} variant='contained' color='success' disabled={isEmpty(botName)}>Create new bot</Button>,
                    <Button key={'close'} onClick={handleClose}>Close</Button>
                ]}
                open={open} title={'Create New Bot'}>
                <Box sx={{ display: 'flex', flexDirection: 'column', padding: (theme) => theme.spacing(1, 0) }}>
                    <TextField
                        fullWidth
                        required
                        label="BOT name"
                        value={botName}
                        onChange={handleBotNameValueChange}
                    />
                    <Typography sx={{ mt: 2 }} variant='h6'>Templates</Typography>
                    <TemplatesViewer onTemplateChange={handleTemplateChange} />
                </Box>
            </AppDialog>
        </>

    )
}
