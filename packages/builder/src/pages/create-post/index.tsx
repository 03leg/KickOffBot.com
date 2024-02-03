import * as React from 'react';
import Layout from '../Layout';
import { Box } from '@mui/material';
import { SocialMediaAccounts } from '~/components/SocialMediaAccounts';
import { PostCreator } from '~/components/PostCreator';
import { SnackbarProvider } from 'notistack';

export default function CreatePage() {
    return (
        <Layout>
            <Box sx={{ padding: (theme) => theme.spacing(2), height: '100%', display: 'flex' }}>
                <SnackbarProvider />
                <SocialMediaAccounts />
                <PostCreator />
            </Box>
        </Layout>
    );
}