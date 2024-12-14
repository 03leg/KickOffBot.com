import { Alert, Box, Button } from '@mui/material';
import React from 'react';
import { useErrorMessagesStyles } from './ErrorMessages.style';
import { ChatErrorDescription } from '../../store/store.types';

interface Props {
    error: ChatErrorDescription;
    onRetry: () => void
}

export const ErrorMessages = ({ error, onRetry }: Props) => {
    const { classes } = useErrorMessagesStyles();
    return (
        <Box className={classes.root}>
            <Alert className={classes.error} severity="error">{error.message}
                {error.showRestartButton === true && <Button color='error' className={classes.button} variant="contained" onClick={onRetry}>Restart bot</Button>}
            </Alert>
        </Box>
    )
}
