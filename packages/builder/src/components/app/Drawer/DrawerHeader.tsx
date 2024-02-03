import { styled } from "@mui/material";

const DrawerHeaderStyled = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));


export const DrawerHeader = () => {
    return <DrawerHeaderStyled />;
};