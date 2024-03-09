import { Box, IconButton, Menu, MenuItem, TextField } from '@mui/material'
import React, { useCallback, useEffect } from 'react';
import { useInsertPropertyToText } from './useInsertProperyToText';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Props {
    value?: string;
    onValueChange: (value: string) => void;
    propertyNames: string[];
}

export const TextTemplateEditor = ({ value, onValueChange, propertyNames }: Props) => {
    const { handleInsertProperty, inputRef, updateSelectionStart } = useInsertPropertyToText(value ?? '', onValueChange);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(event.target.value);
    }, [onValueChange]);


    useEffect(() => {
        if (value === undefined && propertyNames.length === 1) {
            onValueChange(`<%${propertyNames[0]}%>`);
        }
    }, [value, propertyNames, onValueChange])


    return (
        <Box sx={{ display: 'flex', marginTop: 2, alignItems: 'center' }}>
            <TextField
                label="Template"
                value={value ?? ''}
                onChange={handleValueChange}
                sx={{ width: '100%' }}
                inputRef={inputRef}
                onSelect={updateSelectionStart}
            // InputLabelProps={{ shrink: true }}
            />
            <Box>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    {propertyNames.map((option) => (
                        <MenuItem key={option} onClick={() => { handleInsertProperty(option); handleClose(); }}>
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        </Box>
    )
}
