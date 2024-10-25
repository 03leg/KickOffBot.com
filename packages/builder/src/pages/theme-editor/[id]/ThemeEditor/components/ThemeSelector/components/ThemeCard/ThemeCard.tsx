import { Card, CardContent, Typography, CardActions, Box, Button, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import React from 'react';
import { ThemeResponse } from '~/types/Bot';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { useThemeCardStyles } from './ThemeCard.style';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useConfirm } from 'material-ui-confirm';



interface Props {
    isPublic: boolean;
    theme: ThemeResponse;
    isApplied: boolean;
    isSelected: boolean;

    onDeleteTheme?: (theme: ThemeResponse, isPublic: boolean) => void;
    onEditTheme: (theme: ThemeResponse, isPublic: boolean) => void;
    onApplyTheme: (theme: ThemeResponse, isPublic: boolean) => void;
    onTryTheme: (theme: ThemeResponse) => void;
}

export default function ThemeCard({ theme, isApplied = false, isSelected, isPublic, onDeleteTheme, onEditTheme, onApplyTheme, onTryTheme }: Props) {
    const { classes } = useThemeCardStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const confirm = useConfirm();

    const handleOpenActionMenu = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);
    const handleClose = React.useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleDelete = React.useCallback(() => {

        void confirm({ description: "This will permanently delete the theme.", title: 'Are you sure?' })
            .then(() => {
                onDeleteTheme?.(theme, isPublic);
            }).catch();


        handleClose();
    }, [confirm, handleClose, isPublic, onDeleteTheme, theme]);

    const handleEdit = React.useCallback(() => {
        onEditTheme(theme, isPublic);
        handleClose();
    }, [handleClose, isPublic, onEditTheme, theme]);

    const handleApplyTheme = React.useCallback(() => {
      
        void confirm({ description: "This will overwrite your current bot theme.", title: 'Are you sure?' })
        .then(() => {
            onApplyTheme(theme, isPublic);
        }).catch();

        handleClose();
    }, [confirm, handleClose, isPublic, onApplyTheme, theme]);

    const handleTryTheme = React.useCallback(() => {
        onTryTheme(theme);
        handleClose();
    }, [handleClose, onTryTheme, theme]);


    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} variant="h6" component="div" title={theme.title}>
                    {theme.title}
                </Typography>
            </CardContent>
            <CardActions sx={{ mt: "auto", display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isApplied && <Tooltip title="Your current bot theme"><DoneOutlineIcon color="success" sx={{ mr: 2 }} fontSize='inherit' /></Tooltip>}
                    {!isSelected && <Button size="small" variant='contained' color='success' onClick={handleTryTheme}>Try</Button>}
                    {!isApplied && isSelected && <Button size="small" variant='contained' color='primary' onClick={handleApplyTheme}>Apply</Button>}
                </Box>
                <IconButton
                    onClick={handleOpenActionMenu}
                >
                    <MoreVertIcon />
                </IconButton>
            </CardActions>
            <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose}
            >
                <MenuItem onClick={handleEdit}>
                    {isPublic ? 'Modify' : 'Edit'}
                </MenuItem>
                {!isPublic && <MenuItem onClick={handleDelete}>
                    Delete
                </MenuItem>}
            </Menu>
        </Card>
    )
}
