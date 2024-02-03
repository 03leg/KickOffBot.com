import * as React from 'react';
import Box from '@mui/material/Box';
import { Drawer } from '~/components/app/Drawer';
import { MainContent } from '~/components/app/MainContent';
import { Header } from '~/components/app/Header';

export default function Layout({ children }: React.PropsWithChildren) {
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Header open={open} handleDrawerToggle={handleDrawerOpen} />
            <Drawer open={open} />
            <MainContent open={open}>{children}</MainContent>
        </Box>

    )
}