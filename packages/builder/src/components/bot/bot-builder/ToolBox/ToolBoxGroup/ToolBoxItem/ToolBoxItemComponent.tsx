import React, { useEffect, useState } from 'react'
import { DraggableElementData, type ToolBoxItem } from '../../types'
import { Box, Typography } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';
import { v4 } from 'uuid';

interface Props {
    item: ToolBoxItem;
}

export const ToolBoxItemComponent = ({ item }: Props) => {
    const [id, setId] = useState<string>(`${item.type}-${v4()}`);

    const data: DraggableElementData = {
        type: item.type,
        elementWidth: 333,
        isNewElement: true,
    };
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data,
    });
    // const style = {
    //     transform: CSS.Translate.toString(transform),
    // };

    useEffect(() => {

        // console.log('isDragging', isDragging)
        if (isDragging === false) {
            setId(`${item.type}-${v4()}`)
        }

    }, [isDragging, item.type]);

    return (
        <Box ref={setNodeRef} {...listeners} {...attributes} sx={{
            margin: 0.5, display: 'flex',
            backgroundColor: ({ palette }) => palette.grey[100], borderRadius: 1, padding: 1,
            "&:hover": {
                boxShadow: '0 2px 8px #c7c7c7fa',
                transition: 'all .10s ease-in',
            }
        }}>
            {item.icon}
            < Typography sx={{ marginLeft: 0.5, cursor: 'default' }}> {item.title}</Typography >
        </Box >
    )
}
