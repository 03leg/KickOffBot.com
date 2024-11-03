import { Alert, Box } from '@mui/material';
import React from 'react';
import { useErrorMessagesStyles } from './ErrorMessages.style';

interface Props {
    errorMessages: string[];
}

export const ErrorMessages = ({ errorMessages }: Props) => {
    const { classes } = useErrorMessagesStyles();
    return (
        <Box className={classes.root}>
            {errorMessages.map(m => <Alert key={m} className={classes.error} severity="error">{m}</Alert>)}
        </Box>
    )
}
