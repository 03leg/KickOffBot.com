import React from 'react'
import { type ToolBoxItem } from '../../types'
import { Box, Typography } from '@mui/material';

interface Props {
    item: ToolBoxItem;
}

export const ToolBoxItemComponent = ({ item }: Props) => {
    return (
        <Box sx={{ margin: 1, display: 'flex', backgroundColor: ({ palette }) => palette.grey[100], borderRadius: 1, padding: 2 }}>
            {item.icon}
            <Typography sx={{ marginLeft: 0.5 }}>{item.title}</Typography>
        </Box>
    )
}
