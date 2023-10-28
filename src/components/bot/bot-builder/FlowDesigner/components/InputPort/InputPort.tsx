import { Box } from '@mui/material';
import React from 'react'
import { Colors } from '~/themes/Colors';

interface Props {
    className: string;
    blockId: string;
}

export const InputPort = ({ className, blockId }: Props) => {
    return (
        <Box
            className={className}
            data-block-id={blockId}
            sx={{
                height: 16,
                width: 16,
                borderRadius: 8,
                backgroundColor: Colors.INPUT,
                top: 5,
                left: -8,
                border: `2px solid ${Colors.BORDER}`
            }}></Box>
    )
}
