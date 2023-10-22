import { Box, IconButton } from '@mui/material'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Colors } from '~/themes/Colors';

export const ElementMenu = () => {
    return (
        <Box sx={{ display: 'flex', backgroundColor: Colors.WHITE, borderRadius: 1, border: `1px solid ${Colors.BORDER}`, padding: 0.5 }}>
            <IconButton size='small' aria-label="edit">
                <EditIcon />
            </IconButton>
            <IconButton size='small' aria-label="delete">
                <DeleteIcon />
            </IconButton>
        </Box>
    )
}
