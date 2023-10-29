import * as React from 'react';
import { Box } from '@mui/material';
import { DndContext, MeasuringStrategy, type DragEndEvent, pointerWithin, type DragOverEvent, type DragStartEvent, type UniqueIdentifier, useDroppable, useSensor, useSensors, PointerSensor, KeyboardSensor, type Active, type DataRef } from '@dnd-kit/core';
import { useCallback, useMemo, useState } from 'react';
import { findIndex, isNil, remove } from 'lodash';
import { type TransformDescription } from '~/components/bot/bot-builder/FlowDesigner/types';
import { ElementType, type FlowDesignerUIBlockDescription, type UIElement } from '~/components/bot/bot-builder/types';
import { FlowDesigner } from '~/components/bot/bot-builder/FlowDesigner';
import { flowDesignerTransformModifier } from '~/components/bot/bot-builder/FlowDesigner/flowDesignerTransformModifier';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { getNewBlock, getNewUIElementTemplate, getPositionForNewBlock } from '~/components/bot/bot-builder/utils';
import { type DraggableElementData } from '~/components/bot/bot-builder/ToolBox/types';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';


export const EditBotContent = () => {
    const flowDesignerTransformDescription = React.useRef<TransformDescription | null>(null);
    const [activeDraggableItem, setActiveDraggableItem] = useState<Active | null>();
    const [clonedItems, setClonedItems] = useState<FlowDesignerUIBlockDescription[] | null>(null);
    const { blocks, updateBlocks } = useFlowDesignerStore((state) => ({
        updateBlocks: state.updateBlocks,
        blocks: state.project?.blocks ?? []
    }));

    const { changeTransformDescription } = useFlowDesignerStore((state) => ({ changeTransformDescription: state.changeTransformDescription }));

    const { setNodeRef, node } = useDroppable({
        id: 'droppable-area-for-new-elements',
        data: {
            accepts: [ElementType.CONTENT_TEXT],
        },
    });

    const activeId = useMemo(() => {
        if (isNil(activeDraggableItem)) {
            return null;
        }

        return activeDraggableItem.id;
    }, [activeDraggableItem]);

    const existsUIElementsInfo = useMemo(() => {
        const elementBlockMap = new Map<UIElement, FlowDesignerUIBlockDescription>();
        const uiElements = [];
        const uiElementIds = [];
        for (const block of blocks) {
            uiElements.push(...block.elements);

            for (const element of block.elements) {
                elementBlockMap.set(element, block);
                uiElementIds.push(element.id);
            }
        }

        return { uiElements, uiElementIds, elementBlockMap };
    }, [blocks]);

    const activeElement = useMemo(() => {
        // const allElements = blocks.map(b => b.elements).flat(1);
        const { uiElements: existsUIElements } = existsUIElementsInfo;
        const draggableElement = existsUIElements.find(e => e.id === activeId);
        const currentData = (activeDraggableItem?.data as DataRef<DraggableElementData>)?.current;

        if (isNil(draggableElement) && !isNil(activeId) && !isNil(currentData) && currentData.isNewElement) {
            const template = getNewUIElementTemplate(activeId.toString(), currentData) as UIElement;

            return template;
        }

        return draggableElement;
    }, [activeDraggableItem?.data, activeId, existsUIElementsInfo]);

    const handleTransformDescriptionChange = useCallback((newValue: TransformDescription) => {
        if (newValue !== flowDesignerTransformDescription.current) {
            changeTransformDescription(newValue);
        }

        flowDesignerTransformDescription.current = newValue;
    }, [changeTransformDescription])

    const handleBlocksUpdate = (newBlocks: FlowDesignerUIBlockDescription[]) => {
        updateBlocks([...newBlocks]);
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
                tolerance: 5,
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(args: DragEndEvent) {
        const addNewBlock = () => {
            if (activeElement) {
                const newBlockPosition = getPositionForNewBlock(args, node.current, flowDesignerTransformDescription.current);
                if (!isNil(newBlockPosition)) {
                    const newBlock = getNewBlock(newBlockPosition, activeElement, `Block #${blocks.length}`);
                    handleBlocksUpdate([...blocks, newBlock]);
                }
            }
        }

        const { active, over } = args;
        const activeContainer = findContainer(active.id);

        if (isNil(over) && isNil(activeContainer)) {
            addNewBlock();
            return;
        }


        if (!activeContainer) {
            setActiveDraggableItem(null);
            return;
        }

        const overId = over?.id;

        if (overId == null) {
            setActiveDraggableItem(null);
            return;
        }

        const overContainer = findContainer(overId);
        let newBlocks: FlowDesignerUIBlockDescription[] | null = null;

        if (overContainer) {
            const activeIndex = findIndex(activeContainer.elements, (elem) => elem.id === active.id);
            const overIndex = findIndex(overContainer.elements, (elem) => elem.id === overId);

            if (activeIndex !== overIndex) {
                overContainer.elements = arrayMove(overContainer.elements, activeIndex, overIndex);
                newBlocks = [...blocks];
            }
        }

        if (newBlocks !== null) {
            handleBlocksUpdate([...newBlocks]);
        }
        setActiveDraggableItem(null);
    }

    const onDragCancel = () => {
        if (clonedItems) {
            handleBlocksUpdate(clonedItems);
        }

        setActiveDraggableItem(null);
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

        setActiveDraggableItem(active);
        setClonedItems(blocks);
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;


        if (isNil(over)) {

            const currentData = (activeDraggableItem?.data as DataRef<DraggableElementData>)?.current;

            if (currentData && currentData.isNewElement && activeElement && activeId && existsUIElementsInfo.uiElements.includes(activeElement)) {
                const block = existsUIElementsInfo.elementBlockMap.get(activeElement);

                if (block) {
                    remove(block.elements, e => e === activeElement);
                    handleBlocksUpdate([...blocks]);
                }
            }

            return;
        }

        const { id } = active;
        const overId = over.id;

        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        const getIndex = (overIndex: number, elements: UIElement[]) => {
            const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top >
                over.rect.top + over.rect.height;
            const modifier = isBelowOverItem ? 1 : 0;

            const newIndex =
                overIndex >= 0 ? overIndex + modifier : elements.length + 1;

            return newIndex;
        }

        const currentData = (activeDraggableItem?.data as DataRef<DraggableElementData>)?.current;


        if (overContainer && activeElement && currentData && currentData.isNewElement && !overContainer.elements.find(localElement => localElement.id === activeElement.id)) {
            const overIndex = findIndex(overContainer.elements, p => p.id === overId);
            const newIndex = getIndex(overIndex, overContainer.elements);
            overContainer.elements.splice(newIndex, 0, { ...activeElement });

            handleBlocksUpdate([...blocks]);
            return;
        }

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

            const newIndex = getIndex(overIndex, overItems);

            const element = activeContainer.elements[activeIndex]!;
            activeContainer.elements = activeContainer.elements.filter((item) => item.id !== active.id);
            overContainer.elements = [...overContainer.elements.slice(0, newIndex), element, ...overContainer.elements.slice(newIndex, overContainer.elements.length)]

            return prevBlocks;
        };

        const newBlocks = getNewBlocks(blocks);
        handleBlocksUpdate(newBlocks);
    }

    return (
        <Box sx={{ padding: (theme) => theme.spacing(2), height: '100%', display: 'flex', flexDirection: 'row' }} >
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
                modifiers={[flowDesignerTransformModifier(flowDesignerTransformDescription.current, node)]}
            >
                <Box sx={{ flex: 1 }}>
                    <FlowDesigner
                        blocks={blocks}
                        onTransformDescriptionChange={handleTransformDescriptionChange}
                        onUpdateBlocks={handleBlocksUpdate}
                        activeElement={activeElement}
                        setNodeRef={setNodeRef} />
                </Box>
            </DndContext>
        </Box>
    )
}