import { Box } from '@mui/material'
import React from 'react'
import { useStyles } from './FlowDesignerBlock.style';
import { type TransformDescription } from '../../types';
import { useFlowDesignerBlockMovements } from './useFlowDesignerBlockMovements';

interface Props {
    color: string;
    transformDescriptionInitial: Omit<TransformDescription, 'scale'>;
    rootScale: number;
}

export const FlowDesignerBlock = ({ color, transformDescriptionInitial, rootScale }: Props) => {
    const { classes } = useStyles();
    const { bind, transformDescription } = useFlowDesignerBlockMovements(transformDescriptionInitial, rootScale);

    return (
        <Box {...bind()} className={classes.root} style={{ transform: `translate(${transformDescription.x}px, ${transformDescription.y}px)` }}>
            <Box sx={{ backgroundColor: color, height: 100, width: 140 }}></Box>
        </Box>
    )
}
