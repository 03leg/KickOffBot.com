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
    const [selectedBlock, setSelectedBlock] = useState<FlowDesignerUIBlockDescription | null>(null);
    const [selectedElement, setSelectedElement] = useState<UIElement | null>(null);


    useEffect(() => {
        onTransformDescriptionChange(transforDescription);
    }, [onTransformDescriptionChange, transforDescription]);

    return (
        <Box ref={setNodeRef} className={classes.root} {...bind()}>
            <ToolBox />
            <FlowDesignerContext.Provider value={{ selectedBlock, selectedElement, setSelectedBlock, setSelectedElement }}>
                <svg className={classes.svgViewPort} style={{ transform: `translate(${transforDescription.x}px, ${transforDescription.y}px) scale(${transforDescription.scale})` }}>
                    <g>
                        <g>
                            <path stroke="gray" strokeWidth="3" d="M146.83750915527344 132.1000099182129 C196.83750915527344 132.1000099182129, 359.1000061035156 132.1000099182129, 409.1000061035156 132.1000099182129"></path>
                        </g>
                    </g>
                </svg>
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
            </FlowDesignerContext.Provider>
        </Box>
    )
}
