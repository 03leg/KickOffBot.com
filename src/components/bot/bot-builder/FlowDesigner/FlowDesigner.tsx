'use client';

import { Box } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { useStyles } from './FlowDesigner.style'
import { useFlowDesignerNavigation } from './useFlowDesignerNavigation';
import { FlowDesignerBlock } from './components/FlowDesignerBlock';
import { DragOverlay, type DropAnimation, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { type UIElement, type FlowDesignerUIBlockDescription } from '../types';
import { type TransformDescription } from './types';
import { createPortal } from 'react-dom';
import { ElementView } from './components/ElementView';
import { ToolBox } from '../ToolBox';

interface Props {
    blocks: FlowDesignerUIBlockDescription[];
    onTransformDescriptionChange: (newTransform: TransformDescription) => void;
    onUpdateBlocks: (newBlocks: FlowDesignerUIBlockDescription[]) => void;

    setNodeRef?: React.Ref<unknown>;
    activeElement?: UIElement;
}

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};


export const FlowDesigner = ({ blocks, onTransformDescriptionChange, setNodeRef, activeElement }: Props) => {
    const { classes } = useStyles();
    const { bind, transforDescription } = useFlowDesignerNavigation();
    const blocksOwner = useRef<HTMLDivElement>();

    useEffect(() => {
        onTransformDescriptionChange(transforDescription);
    }, [onTransformDescriptionChange, transforDescription]);

    return (
        <Box ref={setNodeRef} className={classes.root} {...bind()}>
            <ToolBox /> 
            <Box ref={blocksOwner} className={classes.viewPort} style={{ transform: `translate(${transforDescription.x}px, ${transforDescription.y}px) scale(${transforDescription.scale})` }}>
                    {blocks.map(b => <FlowDesignerBlock key={b.id} blockDescription={b} rootScale={transforDescription.scale} />)}
                    {blocksOwner.current && 
                    createPortal(
                        <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
                            {activeElement
                                ? <ElementView element={activeElement} />
                                : null}
                        </DragOverlay>, blocksOwner.current).children}
            </Box>
        </Box>
    )
}
