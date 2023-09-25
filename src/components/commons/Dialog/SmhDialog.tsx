import * as React from 'react';
import { Breakpoint, styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from 'tss-react/mui';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { isNil } from 'lodash';

interface DialogProps {
    title: string;
    open: boolean;
    onClose: () => void;
    buttons: React.ReactNode[];
    maxWidth?: Breakpoint | false;
    isLoading?: boolean;
    error?: unknown;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

interface DialogTitleProps {
    children?: React.ReactNode;
    onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

const useStyles = makeStyles()({
    "isLoading": {
        opacity: 0.5,
        pointerEvents: 'none'
    }
});

export default function SmhDialog({ open, onClose, title, children, buttons, maxWidth, isLoading, error }: React.PropsWithChildren<DialogProps>) {
    const { classes } = useStyles();

    const errorMessage = React.useMemo(() => {
        if (!isNil(error)) {
            const errorMsg = 'Oops! Something went wrong. Please try again later.'

            return errorMsg
        }

        return null;
    }, [error]);

    return (
        <BootstrapDialog
            maxWidth={maxWidth}
            fullWidth
            onClose={onClose}
            open={open}
        >
            <BootstrapDialogTitle onClose={onClose}>
                {title}
            </BootstrapDialogTitle>
            <DialogContent dividers className={isLoading ? classes.isLoading : undefined}>
                {errorMessage && !isLoading && <Alert sx={{ marginBottom: '1rem' }} severity="error">{errorMessage}</Alert>}
                {children}
            </DialogContent>
            <DialogActions>
                {!isLoading && buttons}
                {isLoading && (
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress size={'1.5rem'} sx={{ marginRight: 1 }} />
                        Loading...
                    </Box>
                )
                }
            </DialogActions>
        </BootstrapDialog>
    );
}
