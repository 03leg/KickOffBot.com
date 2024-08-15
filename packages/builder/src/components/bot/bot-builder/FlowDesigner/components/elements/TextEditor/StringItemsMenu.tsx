import { IconButton, Menu, MenuItem } from '@mui/material';
import React from 'react';

interface Props {
    buttonIcon: JSX.Element;
    values: string[];
    onInsertItem: (property: string) => void;
}

export const StringItemsMenu = ({ values, onInsertItem, buttonIcon }: Props) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleOpenMenu = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleCloseMenu = React.useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleInsertPropertyInText = React.useCallback((property: string) => {
        // const newState = insertText(getTextPropertyReference(property), editorState);
        // setEditorState(newState);
        // generatePublicContentChange(newState);
        handleCloseMenu();

        onInsertItem(property);
    }, [handleCloseMenu, onInsertItem]);


    return (
        <>
            <IconButton
                aria-label="more"
                id="contextObjectProperties-menu-button"
                aria-controls={openMenu ? 'contextObjectProperties-menu' : undefined}
                aria-expanded={openMenu ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleOpenMenu}
            >
                {buttonIcon}
            </IconButton>
            <Menu
                id="contextObjectProperties-menu"
                MenuListProps={{
                    'aria-labelledby': 'contextObjectProperties-menu-button',
                }}
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
            >
                {values.map((item) => <MenuItem key={item} onClick={() => handleInsertPropertyInText(item)}>{item}</MenuItem>)}
            </Menu>
        </>
    )
}
