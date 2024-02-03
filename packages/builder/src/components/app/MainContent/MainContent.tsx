import { styled } from '@mui/material';
import React from 'react';
import { drawerWidth, headerHeight } from '../contstants';
import { Colors } from '~/themes/Colors';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    marginTop: headerHeight,
    height: `calc(100vh - ${headerHeight}px)`,
    flexGrow: 1,
    backgroundColor: Colors.BACKGROUND_COLOR,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface MainContentProps {
    open: boolean;
}


export function MainContent({ open, children }: React.PropsWithChildren<MainContentProps>) {
    return (
        <Main open={open}>
            {children}
        </Main>
    )
}