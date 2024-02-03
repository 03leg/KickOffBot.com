import { Avatar, Box, Divider, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { Colors } from '~/themes/Colors'
import { AddSocialMediaAccount } from '../AddSocialMediaAccount'
import { api } from '~/utils/api'
import { TelegramIcon } from '~/themes/icons/TelegramIcon'
import { blue } from '@mui/material/colors'

export const SocialMediaAccounts = () => {
    const { data = [], refetch } = api.socialMediaAccount.getAllAccounts.useQuery();

    const handleAddNewAccount = useCallback(() => {
        void refetch();
    }, [refetch]);

    return (
        <Box sx={{
            backgroundColor: Colors.WHITE,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
            maxWidth: 300,
            boxShadow: '0px 1px 6px hsla(245, 50%, 17%, 0.1)',
            marginRight: ({ spacing }) => spacing(2),
        }}>
            {data.length !== 0 && (
                <List sx={{ flex: 1 }}>
                    {data.map((socialMediaAccount) => (
                        <ListItem key={socialMediaAccount.id} disablePadding>
                            <ListItemButton>
                                <Avatar sx={{ bgcolor: blue[100] }}>
                                    <TelegramIcon />
                                </Avatar>
                                <ListItemText sx={{ marginLeft: (theme) => theme.spacing(2) }} primary={socialMediaAccount.title} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
            {data.length === 0 && (
                <Typography variant="h4" sx={{ flex: 1, textAlign: 'center', marginTop: ({ spacing }) => spacing(4) }}>
                    You do not have social media accounts yet
                </Typography>
            )}
            <Divider />
            <AddSocialMediaAccount onAddNewAccount={handleAddNewAccount} />
        </Box>
    )
}
