'use client';

import { Box } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useStyles } from './FlowDesigner.style'
import { useFlowDesignerNavigation } from './useFlowDesignerNavigation';
import { FlowDesignerBlock } from './components/FlowDesignerBlock';
import { DragOverlay, type DropAnimation, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { type UIElement, type FlowDesignerUIBlockDescription } from '../types';
import { type TransformDescription } from './types';
import { createPortal } from 'react-dom';
import { ElementView } from './components/ElementView';
import { ToolBox } from '../ToolBox';
import { FlowDesignerContext } from './context';
import { SvgCanvas } from './components/SvgCanvas';
import { useFlowDesignerStore } from '../store';

interface Props {
    blocks: FlowDesignerUIBlockDescription[];
    onTransformDescriptionChange: (newTransform: TransformDescription) => void;

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

    const { initialTransformDescription } = useFlowDesignerStore((state) => ({
        initialTransformDescription: state.project.transformDescription
    }));

    const { bind, transformDescription } = useFlowDesignerNavigation(initialTransformDescription);
    const blocksOwner = useRef<HTMLDivElement>();
    const [selectedBlock, setSelectedBlock] = useState<FlowDesignerUIBlockDescription | null>(null);
    const [selectedElement, setSelectedElement] = useState<UIElement | null>(null);


    useEffect(() => {
        onTransformDescriptionChange(transformDescription);
    }, [onTransformDescriptionChange, transformDescription]);

    return (
        <Box ref={setNodeRef} className={classes.root} {...bind()}>
            <ToolBox />
            <FlowDesignerContext.Provider value={{ selectedBlock, selectedElement, setSelectedBlock, setSelectedElement }}>
                <SvgCanvas />
                <Box ref={blocksOwner} className={classes.viewPort} style={{ transform: `translate(${transformDescription.x}px, ${transformDescription.y}px) scale(${transformDescription.scale})` }}>
                    {blocks.map(b => <FlowDesignerBlock key={b.id} blockDescription={b} rootScale={transformDescription.scale} />)}
                    {blocksOwner.current &&
                        createPortal(
                            <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
                                {activeElement
                                    ? <ElementView element={activeElement} />
                                    : null}
                            </DragOverlay>, blocksOwner.current).children}
                </Box>
            </FlowDesignerContext.Provider>
        </Box>
    )
}
