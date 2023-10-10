'use client';

import { Box } from '@mui/material'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useStyles } from './FlowDesigner.style'
import { useFlowDesignerNavigation } from './useFlowDesignerNavigation';
import { FlowDesignerBlock } from './components/FlowDesignerBlock';
import { type DragOverEvent, type DragStartEvent, type UniqueIdentifier, useDroppable, MeasuringStrategy, DragOverlay, type DropAnimation, defaultDropAnimationSideEffects, pointerWithin } from '@dnd-kit/core';
import { ElementType, type FlowDesignerUIBlockDescription } from '../types';
import { type TransformDescription } from './types';
import { DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { findIndex, isNil } from 'lodash';
import { createPortal } from 'react-dom';
import { ElementView } from './components/ElementView';
import { flowDesignerTransformModifier } from './flowDesignerTransformModifier';

interface Props {
    blocks: FlowDesignerUIBlockDescription[];
    onTransformDescriptionChange: (newTransform: TransformDescription) => void;
    onUpdateBlocks: (newBlocks: FlowDesignerUIBlockDescription[]) => void;
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


export const FlowDesigner = ({ blocks, onTransformDescriptionChange, onUpdateBlocks }: Props) => {
    const { classes } = useStyles();
    const { bind, transforDescription } = useFlowDesignerNavigation();
    const { setNodeRef, node } = useDroppable({
        id: 'droppable-area-for-new-elements',
        data: {
            accepts: [ElementType.CONTENT_TEXT],
        },
    });
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>();
    const [clonedItems, setClonedItems] = useState<FlowDesignerUIBlockDescription[] | null>(null);
    const blocksOwner = useRef<HTMLDivElement>();

    const activeElement = useMemo(() => {
        const allElements = blocks.map(b => b.elements).flat(1);
        const draggableElement = allElements.find(e => e.id === activeId);

        return draggableElement;
    }, [activeId, blocks]);

    useEffect(() => {
        onTransformDescriptionChange(transforDescription);
    }, [onTransformDescriptionChange, transforDescription])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd({ active, over }: DragEndEvent) {
        const activeContainer = findContainer(active.id);

        if (!activeContainer) {
            setActiveId(null);
            return;
        }

        const overId = over?.id;

        if (overId == null) {
            setActiveId(null);
            return;
        }

        const overContainer = findContainer(overId);

        if (overContainer) {
            const activeIndex = findIndex(activeContainer.elements, (elem) => elem.id === active.id);
            const overIndex = findIndex(overContainer.elements, (elem) => elem.id === overId);

            if (activeIndex !== overIndex) {
                overContainer.elements = arrayMove(overContainer.elements, activeIndex, overIndex);
                onUpdateBlocks([...blocks]);
            }
        }

        setActiveId(null);
    }

    const onDragCancel = () => {
        if (clonedItems) {
            onUpdateBlocks(clonedItems);
        }

        setActiveId(null);
        setClonedItems(null);
    };

    function findContainer(id: UniqueIdentifier) {
        for (const block of blocks) {
            const child = block.elements.find(e => e.id === id);
            if (!isNil(child)) {
                return block;
            }
        }

        return null;
    }


    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const { id } = active;

        setActiveId(id);
        setClonedItems(blocks);
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (isNil(over)) {
            return;
        }

        const { id } = active;
        const overId = over.id;
        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        if (
            isNil(activeContainer) ||
            isNil(overContainer) ||
            activeContainer === overContainer
        ) {
            return;
        }

        const getNewBlocks = (prevBlocks: FlowDesignerUIBlockDescription[]) => {
            const activeItems = activeContainer.elements;
            const overItems = overContainer.elements;
            const overIndex = findIndex(overItems, p => p.id === overId);
            const activeIndex = findIndex(activeItems, p => p.id === active.id);

            const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top >
                over.rect.top + over.rect.height;

            const modifier = isBelowOverItem ? 1 : 0;

            const newIndex =
                overIndex >= 0 ? overIndex + modifier : overItems.length + 1;

            const element = activeContainer.elements[activeIndex]!;
            activeContainer.elements = activeContainer.elements.filter((item) => item.id !== active.id);
            overContainer.elements = [...overContainer.elements.slice(0, newIndex), element, ...overContainer.elements.slice(newIndex, overContainer.elements.length)]


            return prevBlocks;
        };


        const newBlocks = getNewBlocks(blocks);
        onUpdateBlocks(newBlocks);
    }

    return (
        <Box ref={setNodeRef} className={classes.root} {...bind()}>
            <Box ref={blocksOwner} className={classes.viewPort} style={{ transform: `translate(${transforDescription.x}px, ${transforDescription.y}px) scale(${transforDescription.scale})` }}>
                <DndContext
                    onDragOver={handleDragOver}
                    onDragStart={handleDragStart}
                    sensors={sensors}
                    onDragEnd={handleDragEnd}
                    onDragCancel={onDragCancel}
                    measuring={{
                        droppable: {
                            strategy: MeasuringStrategy.Always,
                        },
                    }}
                    collisionDetection={pointerWithin}
                    modifiers={[flowDesignerTransformModifier(transforDescription, node)]}
                >
                    {blocks.map(b => <FlowDesignerBlock key={b.id} blockDescription={b} rootScale={transforDescription.scale} />)}
                    {blocksOwner.current && createPortal(
                        <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
                            {activeId && activeElement
                                ? <ElementView element={activeElement} />
                                : null}
                        </DragOverlay>,
                        blocksOwner.current
                    )}
                </DndContext>
            </Box>
        </Box>
    )
}
