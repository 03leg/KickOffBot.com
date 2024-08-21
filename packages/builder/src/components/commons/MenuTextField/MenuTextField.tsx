import { Box, IconButton, Menu, MenuItem, TextField } from '@mui/material';
import React, { use, useCallback } from 'react';
import { useMenuTextFieldStyles } from './MenuTextField.style';
import MoreVertIcon from '@mui/icons-material/MoreVert';


interface Props {
    dataSource: { label: string; value: string }[];
    onChange: (value: string) => void;
    value: string;
}

export const MenuTextField = ({ dataSource, onChange, value }: Props) => {
    const { classes } = useMenuTextFieldStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleSelectMenuItem = useCallback((data: { label: string; value: string }) => {
        onChange(data.value)
     }, [onChange])


    return (
        <Box className={classes.root}>
            <TextField fullWidth variant="outlined" value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} />
            <Box className={classes.menuButton}>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={openMenu ? 'long-menu' : undefined}
                    aria-expanded={openMenu ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleOpenMenu}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                >
                    {dataSource.map((option) => (
                        <MenuItem key={option.value} onClick={() => { handleSelectMenuItem(option); handleCloseMenu(); }}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        </Box>
    )
}
