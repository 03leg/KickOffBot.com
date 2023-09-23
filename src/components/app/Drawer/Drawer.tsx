
// material-ui
import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { DrawerHeader } from './DrawerHeader';
import { drawerWidth } from '../contstants';
import CreateIcon from '@mui/icons-material/Create';
import { useRouter } from 'next/router';

interface MainDrawerProps {
    open: boolean;
}

export const MainDrawer = ({ open }: MainDrawerProps) => {
    const router = useRouter();

    const paths = [{ title: "Create post", icon: <CreateIcon />, path: '/create-post' }];

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
            {/* <Divider /> */}
            {/* <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List> */}
        </Drawer>
    );
};