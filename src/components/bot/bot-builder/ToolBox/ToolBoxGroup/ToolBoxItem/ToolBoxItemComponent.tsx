import React from 'react'
import { type ToolBoxItem } from '../../types'
import { Box, Typography } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface Props {
    item: ToolBoxItem;
}

export const ToolBoxItemComponent = ({ item }: Props) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: item.type,
        data: {
            type: item.type,
        },
    });
    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <Box ref={setNodeRef} style={style} {...listeners} {...attributes} sx={{ margin: 1, display: 'flex', backgroundColor: ({ palette }) => palette.grey[100], borderRadius: 1, padding: 2 }}>
            {item.icon}
            <Typography sx={{ marginLeft: 0.5 }}>{item.title}</Typography>
        </Box>
    )
}
