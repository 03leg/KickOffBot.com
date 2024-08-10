import { Box, Button, DialogActions, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TelegramIcon } from '~/themes/icons/TelegramIcon';
import { SocialMediaAccount } from '~/types/SocialMediaAccount';
// import SocialAccountConnectorDialog from '../SocialAccountConnectorDialog/SocialAccountConnectorDialog';

interface AddSocialMediaAccountProps {
    onAddNewAccount: () => void;
}

export const AddSocialMediaAccount = ({ onAddNewAccount }: AddSocialMediaAccountProps) => {
    const [open, setOpen] = React.useState(false);
    const [openSocialAccountConnector, setOpenSocialAccountConnector] = React.useState(false);
    const [newAccountType, setNewAccountType] = React.useState<SocialMediaAccount>({} as SocialMediaAccount);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAccountConnectorClose = (success?: boolean) => {

        if (success) {
            onAddNewAccount();
        }

        setOpenSocialAccountConnector(false);
    };

    const handleShowAddAccountDialog = useCallback((accountType: SocialMediaAccount) => {
        setNewAccountType(accountType);
        handleClose();
        setOpenSocialAccountConnector(true);
    }, []);



    return (
        <>
            <Box sx={{ display: "flex", width: '100%', padding: (theme) => theme.spacing() }}>
                <Button sx={{ width: '100%' }} onClick={handleClickOpen}>Add account</Button>
            </Box>
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>Add</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', padding: (theme) => theme.spacing(1, 0) }}>
                        <Button sx={{ flex: 1 }} onClick={() => handleShowAddAccountDialog(SocialMediaAccount.Telegram)}>
                            <TelegramIcon />
                            <Typography sx={{ padding: (theme) => theme.spacing(0, 2) }}>Telegram channel or group</Typography>
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
            {/* <SocialAccountConnectorDialog onClose={handleAccountConnectorClose} open={openSocialAccountConnector} socialMedia={newAccountType} /> */}
        </>

    )
}
