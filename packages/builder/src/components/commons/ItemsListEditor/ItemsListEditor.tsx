import React, { useCallback } from 'react'
import { useItemsListEditorStyles } from './ItemsListEditor.style'
import { Box, Button, List, ListItemButton, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { isNil } from 'lodash';


interface ItemBase {
    id: string;
    title?: string;
}

interface Props<T extends ItemBase> {
    items: T[];
    onNewItem: () => void;
    onDeleteItem: (item: T) => void;
    onSelect: (item: T) => void;
    entryName: string;
    selectedItem?: T;
    detailsView: JSX.Element;

}

export const ItemsListEditor = <T extends ItemBase>({ items, onNewItem, onDeleteItem, entryName, onSelect, selectedItem, detailsView }: Props<T>) => {
    const { classes } = useItemsListEditorStyles();

    const handleNewItem = useCallback(() => {
        onNewItem();
    }, [onNewItem]);

    const handleSelectItem = useCallback((item: T) => {
        onSelect(item);
    }, [onSelect])

    const handleDeleteItem = useCallback((item: T) => {
        onDeleteItem(item);
    }, [onDeleteItem])

    return (
        <Box className={classes.root}>
            <Box sx={{ width: '300px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', margin: 1 }}>
                <List dense={true} sx={{ flex: 1, height: 'calc(100% - 55px)', overflowY: 'auto' }}>
                    {items.length === 0 && <ListItemButton disabled={true} key={'empty'}><ListItemText primary={`You don't have any ${entryName.toLowerCase()} yet...`} /></ListItemButton>}
                    {items.map(currentItem => (
                        <ListItemButton onClick={() => handleSelectItem(currentItem)} selected={selectedItem === currentItem} key={currentItem.id}>
                            <ListItemText
                                primary={currentItem.title ?? currentItem.id}
                                primaryTypographyProps={{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }} /></ListItemButton>
                    ))}
                </List>
                <Box sx={{ padding: 1 }}>
                    <Button color='success' fullWidth variant="contained" startIcon={<AddIcon />} onClick={handleNewItem}>Add new {entryName}</Button>
                    {items.length > 0 && <Button sx={{ marginTop: 1 }} color='error' disabled={isNil(selectedItem)} fullWidth variant="contained" startIcon={<DeleteIcon />} onClick={() => handleDeleteItem(selectedItem!)}>Delete {entryName}</Button>}
                </Box>
            </Box>
            <Box sx={{ padding: 1, paddingLeft: 0, height: '100%', width: '100%' }}>
                {detailsView}
            </Box>
        </Box>
    )
}
