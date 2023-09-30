import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import { useStyles } from './FlowDesigner.style'
import { useFlowDesignerNavigation } from './useFlowDesignerNavigation';
import { FlowDesignerBlock } from './components/FlowDesignerBlock';
import { useDroppable } from '@dnd-kit/core';
import { ElementType, type FlowDesignerUIBlockDescription } from '../types';
import { type TransformDescription } from './types';

interface Props {
    blocks: FlowDesignerUIBlockDescription[];
    onTransformDescriptionChange: (newTransform: TransformDescription) => void;
}


export const FlowDesigner = ({ blocks, onTransformDescriptionChange }: Props) => {
    const { classes } = useStyles();
    const { bind, transforDescription } = useFlowDesignerNavigation();
    const { setNodeRef } = useDroppable({
        id: 'droppable-area-for-new-elements',
        data: {
            accepts: [ElementType.CONTENT_TEXT],
        },
    });

    useEffect(() => {
        onTransformDescriptionChange(transforDescription);
    }, [onTransformDescriptionChange, transforDescription])

    return (
        <Box ref={setNodeRef} className={classes.root} {...bind()}>
            <Box className={classes.viewPort} style={{ transform: `translate(${transforDescription.x}px, ${transforDescription.y}px) scale(${transforDescription.scale})` }}>
                {blocks.map(b => <FlowDesignerBlock key={b.id} blockDescription={b} rootScale={transforDescription.scale} />)}
            </Box>
        </Box>
    )
}
