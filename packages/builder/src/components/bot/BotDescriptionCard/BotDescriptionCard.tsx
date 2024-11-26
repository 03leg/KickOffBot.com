import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { type BotDescription } from '~/types/Bot';
import moment from 'moment';
import { Badge, Box, Chip, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { BotPlatform } from '@kickoffbot.com/types';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useConfirm } from 'material-ui-confirm';

interface Props {
    description: BotDescription;
    onEdit: (botDescription: BotDescription) => void;
    onRemove: (botDescription: BotDescription) => void;
}

export const BotDescriptionCard = ({ description, onEdit, onRemove }: Props) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const router = useRouter();
    const confirm = useConfirm();

    const handleOpenMenu = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);
    const handleClose = React.useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleRemove = React.useCallback(() => {

        void confirm({ description: <>This will permanently delete the bot with name <b>{description.name}</b>.</>, title: 'Are you sure?' })
            .then(() => {
                onRemove(description);
            }).catch();

        handleClose();
    }, [confirm, description, handleClose, onRemove]);

    const handleNavigateThemeEditor = React.useCallback(() => {
        void router.push(`/theme-editor/${description.id}`);
    }, [description.id, router]);

    const platform = useMemo(() => {
        if (description.botType === BotPlatform.Telegram) {
            return 'Telegram';
        } else if (description.botType === BotPlatform.WEB) {
            return "Web";
        }

        throw new Error('InvalidOperationError');
    }, [description.botType]);

    const cardContent = (<Card data-testid="BotDescriptionCard" sx={{
        width: 275,
        display: "flex",
        flexDirection: "column",
    }}>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {moment(description.updatedAt).local().format('YYYY-MM-DD HH:mm')}
                </Typography>
                <Chip label={platform} color={description.botType === BotPlatform.WEB ? 'success' : "info"} />
            </Box>

            <Typography variant="h5" component="div" sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
            }} title={description.name}>
                {description.name}
            </Typography>
        </CardContent>
        <CardActions sx={{ mt: "auto", display: 'flex', justifyContent: 'space-between' }}>
            <Button size="small" onClick={() => (onEdit(description))}>Edit</Button>
            <IconButton
                aria-label="more"
                id="bot-description-menu-button"
                aria-controls={openMenu ? 'bot-description-menu' : undefined}
                aria-expanded={openMenu ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleOpenMenu}
            >
                <MoreVertIcon />
            </IconButton>
        </CardActions>

        <Menu
            id="bot-description-menu"
            MenuListProps={{
                'aria-labelledby': 'bot-description-menu-button',
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
        >
            <MenuItem onClick={handleRemove}>
                Remove
            </MenuItem>
            {description.botType === BotPlatform.WEB &&
                <MenuItem onClick={handleNavigateThemeEditor}>
                    Theme
                </MenuItem>}
        </Menu>
    </Card>);


    return (
        <>
            {
                description.production ? <Badge color="success" badgeContent="online" anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}>
                    {cardContent}
                </Badge> : cardContent
            }
        </>

    );
}