import { Alert, Box, CircularProgress } from '@mui/material'
import React from 'react'
import AppDialog from '~/components/commons/Dialog/AppDialog';
import { useNewBotWizardComponentStyles } from '../../NewBotWizardComponent.style';

interface Props {
    onClose: () => void;
    isLoading: boolean;
    serverError?: string;
}


export const Step4 = ({ onClose, isLoading, serverError }: Props) => {
    const { classes } = useNewBotWizardComponentStyles();

    return (
        <AppDialog
            onClose={onClose}
            maxWidth={'xs'}
            open={true} title={isLoading ? 'Creating bot, please wait...' : (serverError ? '😔 Oops! Something went wrong...' : 'Bot created successfully')} buttons={[
            ]}>
            <Box className={classes.step4Root}>
                {serverError && <Alert sx={{ marginBottom: '1rem', marginTop: '1rem' }} severity="error">{serverError}</Alert>}
                {isLoading && <CircularProgress />}
            </Box>
        </AppDialog>
    )
}
