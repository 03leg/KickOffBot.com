
// material-ui
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { DrawerHeader } from './DrawerHeader';
import { drawerWidth } from '../contstants';
import { useRouter } from 'next/router';
import InsightsIcon from '@mui/icons-material/Insights';
import { MY_BOTS_PATH } from '~/constants';

interface MainDrawerProps {
    open: boolean;
}

export const MainDrawer = ({ open }: MainDrawerProps) => {
    const router = useRouter();

    const paths = [
        // { title: "Create post", icon: <CreateIcon />, path: '/create-post' },
        { title: "My bots", icon: <InsightsIcon />, path: MY_BOTS_PATH },
    ];

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader />
            <List>
                {paths.map((item) => (
                    <ListItem key={item.title} disablePadding>
                        <ListItemButton onClick={() => void router.push(item.path)}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};