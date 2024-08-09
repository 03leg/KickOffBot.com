import * as React from 'react';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import AppAppBar from '~/components/LandingPage/components/AppAppBar';
import Footer from '~/components/LandingPage/components/Footer';

export default function UnknownUserLayout({ children }: React.PropsWithChildren) {
    return (
        <>
            <AppAppBar />
            <Box
                sx={(theme) => ({
                    width: '100%',
                    backgroundImage:
                        theme.palette.mode === 'light'
                            ? 'linear-gradient(180deg, #3985f21f, #FFF)'
                            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
                    backgroundSize: '100% 20%',
                    backgroundRepeat: 'no-repeat',
                })}
            >
                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pt: { xs: 14, sm: 20 },
                        pb: { xs: 8, sm: 12 },
                    }}
                >
                    {children}
                </Container>
            </Box>
            <Box sx={{ bgcolor: 'background.default' }}>
                <Divider />
                <Footer />
            </Box>
        </>
    )
}