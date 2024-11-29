import { Box, Button, TextField } from '@mui/material';
import React from 'react'
import AppDialog from '~/components/commons/Dialog/AppDialog';
import { useNewBotWizardComponentStyles } from '../../NewBotWizardComponent.style';
import { isEmpty } from 'lodash';
import { NewBotWizardDescription } from '../../NewBotWizardComponent.types';

interface Props {
    onClose: () => void;
    onCreateNewBot: (botDescription: NewBotWizardDescription) => void;
    initialBotName: string;
    botNames: string[];
}



export const Step3 = ({ onClose, onCreateNewBot, initialBotName, botNames }: Props) => {
    const { classes } = useNewBotWizardComponentStyles();
    const [botName, setBotName] = React.useState<string>(initialBotName);
    const [error, setError] = React.useState<string | null>(null);


    const handleBotNameValueChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBotName(event.target.value);
        setError(null);

        if (botNames.includes(event.target.value)) {
            setError('Bot name already exists');
        }

    }, [botNames]);

    const handleSave = React.useCallback(() => {

        onCreateNewBot({ name: botName });
    }, [botName, onCreateNewBot]);


    return (
        <AppDialog
            onClose={onClose}
            maxWidth={'xs'}
            open={true} title={"What is the name of your bot?"} buttons={[
                <Button key={'save'} onClick={handleSave} variant='contained' color='success' disabled={isEmpty(botName) || botNames.includes(botName)}>Create new bot</Button>,
            ]}>
            <Box className={classes.step3Root}>
                <TextField
                    fullWidth
                    required
                    label="Bot name"
                    value={botName}
                    error={!!error}
                    helperText={error}
                    onChange={handleBotNameValueChange}
                />
            </Box>
        </AppDialog>
    )
}
