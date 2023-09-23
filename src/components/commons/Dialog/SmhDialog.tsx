import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface DialogProps {
    title: string;
    open: boolean;
    onClose: () => void;
    buttons: React.ReactNode[];
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

export default function SmhDialog({ open, onClose, title, children, buttons }: React.PropsWithChildren<DialogProps>) {

    return (
        <BootstrapDialog
            onClose={onClose}
            open={open}
        >
            <BootstrapDialogTitle onClose={onClose}>
                {title}
            </BootstrapDialogTitle>
            <DialogContent sx={{ minWidth: 400 }} dividers>
                {children}
            </DialogContent>
            <DialogActions>
                {/* <Button autoFocus onClick={onSuccess} variant='contained' color='success'>
                    {successButtonText}
                </Button>
                <Button onClick={onClose}>
                    {cancelButtonText}
                </Button> */}
                {buttons}
            </DialogActions>
        </BootstrapDialog>
    );
}
