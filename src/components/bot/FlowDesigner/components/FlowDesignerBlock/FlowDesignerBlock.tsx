import { Box } from '@mui/material'
import React from 'react'
import { useStyles } from './FlowDesignerBlock.style';
import { useFlowDesignerBlockMovements } from './useFlowDesignerBlockMovements';
import { Colors } from '~/themes/Colors';
import { type FlowDesignerUIBlockDescription } from '~/components/bot/types';

interface Props {
    blockDescription: FlowDesignerUIBlockDescription;
    rootScale: number;
}

export const FlowDesignerBlock = ({ blockDescription, rootScale }: Props) => {
    const { classes } = useStyles();
    const { bind, transformDescription } = useFlowDesignerBlockMovements(blockDescription.position, rootScale);

    return (
        <Box {...bind()} className={classes.root} style={{ transform: `translate(${transformDescription.x}px, ${transformDescription.y}px)` }}>
            <Box sx={{ backgroundColor: Colors.WHITE, border: `1px solid ${Colors.BORDER}`, borderRadius: 1, height: 100, width: 140 }}>

            </Box>
        </Box>
    )
}
