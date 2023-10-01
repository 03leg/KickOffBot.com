import { Box } from '@mui/material'
import React from 'react'
import { useStyles } from './FlowDesignerBlock.style';
import { useFlowDesignerBlockMovements } from './useFlowDesignerBlockMovements';
import { Colors } from '~/themes/Colors';
import { ElementView } from '../ElementView';
import { type FlowDesignerUIBlockDescription } from '../../../types';

interface Props {
    blockDescription: FlowDesignerUIBlockDescription;
    rootScale: number;
}

export const FlowDesignerBlock = ({ blockDescription, rootScale }: Props) => {
    const { classes } = useStyles();
    const { bind, transformDescription } = useFlowDesignerBlockMovements(blockDescription.position, rootScale);

    return (
        <Box {...bind()} className={classes.root} style={{ transform: `translate(${transformDescription.x}px, ${transformDescription.y}px)` }}>
            <Box sx={{ backgroundColor: Colors.WHITE, border: `1px solid ${Colors.BORDER}`, borderRadius: 1, minHeight: 100, width: 350, padding: 1 }}>
                {blockDescription.elements.map(element => (<ElementView key={element.id} element={element} />))}
            </Box>
        </Box>
    )
}
