import { Box } from '@mui/material'
import { useGesture } from '@use-gesture/react';
import React from 'react'
import { Colors } from '~/themes/Colors'

interface Props {
    className: string;
}

export const OutputPort = ({ className }: Props) => {

    const bind = useGesture({
        onDrag: (e) => {
            console.log('onDrag');
        },
        onDragStart: (e) => {
            e.event.stopPropagation();
            console.log('onDragStart',e );
        },
        onDragEnd: (e) => {
            console.log('onDragEnd');
        },
    })

    return (
        <Box {...bind()}
            className={className}
            sx={{
                height: 16,
                width: 16,
                borderRadius: 8,
                backgroundColor: Colors.OUTPUT,
                transition: 'all 1.5s ease-in-out'
            }}></Box>
    )
}
