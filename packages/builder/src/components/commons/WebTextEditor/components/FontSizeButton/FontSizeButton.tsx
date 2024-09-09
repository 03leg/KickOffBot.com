import { IconButton, Menu, MenuItem } from '@mui/material';
import React from 'react'
import FormatSizeIcon from '@mui/icons-material/FormatSize';

const fontSizes: { label: string, value: number }[] = [];

for (let i = 6; i <= 32; i += 2) {
    fontSizes.push({
        label: `${i}px`,
        value: i
    });
}

interface Props {
    onFontSizeChange: (fontSize: number) => void
}

export const FontSizeButton = ({ onFontSizeChange }: Props) => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleSelectFontSize = (option: { label: string, value: number }) => {
        onFontSizeChange(option.value)
    };

    return (
        <>
            <IconButton aria-label="font-size" onClick={handleOpenMenu}>
                <FormatSizeIcon />
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
                {fontSizes.map((option) => (
                    <MenuItem key={option.value} onClick={() => { handleSelectFontSize(option); handleCloseMenu(); }}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}
