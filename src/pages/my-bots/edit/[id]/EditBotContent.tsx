import * as React from 'react';
import { Box } from '@mui/material';
import { DndContext, MeasuringStrategy, type DragEndEvent, pointerWithin, type DragOverEvent, type DragStartEvent, type UniqueIdentifier, useDroppable, useSensor, useSensors, PointerSensor, KeyboardSensor, type Active, type DataRef } from '@dnd-kit/core';
import { useCallback, useMemo, useState } from 'react';
import { findIndex, isNil, remove } from 'lodash';
import { type TransformDescription } from '~/components/bot/bot-builder/FlowDesigner/types';
import { type ContentTextUIElement, ElementType, type FlowDesignerUIBlockDescription, type UIElement } from '~/components/bot/bot-builder/types';
import { FlowDesigner } from '~/components/bot/bot-builder/FlowDesigner';
import { v4 } from 'uuid';
import { flowDesignerTransformModifier } from '~/components/bot/bot-builder/FlowDesigner/flowDesignerTransformModifier';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { getNewBlock, getNewUIElementTemplate, getPositionForNewBlock } from '~/components/bot/bot-builder/utils';
import { type DraggableElementData } from '~/components/bot/bot-builder/ToolBox/types';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';


const generateElements = () => {
    const textUIElement1: ContentTextUIElement = {
        type: ElementType.CONTENT_TEXT,
        text: 'Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1',
        id: '11111' + v4(),
    };
    const textUIElement2: ContentTextUIElement = {
        type: ElementType.CONTENT_TEXT,
        text: 'Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! ' + v4(),
        id: '22222' + v4(),
    };
    const textUIElement3: ContentTextUIElement = {
        type: ElementType.CONTENT_TEXT,
        text: 'Privet3! Privet3! Privet3! ' + v4(),
        id: '33333' + v4(),
    };
    const textUIElement4: ContentTextUIElement = {
        type: ElementType.CONTENT_TEXT,
        text: 'Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1',
        id: '11111' + v4(),
    };
    const textUIElement5: ContentTextUIElement = {
        type: ElementType.CONTENT_TEXT,
        text: 'Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! ' + v4(),
        id: '22222' + v4(),
    };
    const textUIElement6: ContentTextUIElement = {
        type: ElementType.CONTENT_TEXT,
        text: 'Privet3!' + v4(),
        id: '33333' + v4(),
    };
    const textUIElement7: ContentTextUIElement = {
        type: ElementType.CONTENT_TEXT,
        text: 'Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1 Text1',
        id: '11111' + v4(),
    };
    const textUIElement8: ContentTextUIElement = {
        type: ElementType.CONTENT_TEXT,
        text: 'Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! Hey2! ' + v4(),
        id: '22222' + v4(),
    };
    const textUIElement9: ContentTextUIElement = {
        type: ElementType.CONTENT_TEXT,
        text: 'Privet3! Privet3! Privet3! Privet3!  Privet3!  Privet3!  Privet3!  Privet3!' + v4(),
        id: '33333' + v4(),
    };
    return [
        textUIElement1,
        textUIElement2,
        textUIElement3,
        textUIElement4,
        textUIElement5,
        textUIElement6,
        textUIElement7,
        textUIElement8,
        textUIElement9,
    ]
};

export const EditBotContent = () => {
    const flowDesignerTransformDescription = React.useRef<TransformDescription | null>(null);
    const [blocks, setBlocks] = React.useState<FlowDesignerUIBlockDescription[]>([
        { id: '0', title: 'Block #1', position: { x: 500, y: 0 }, elements: generateElements() },
        { id: '1', title: 'Block #2', position: { x: 0, y: 500 }, elements: generateElements() },
        // { id: '2', position: { x: 500, y: 300 }, elements: generateElements() },
    ]);
    // const dragMode = useRef<boolean>(false);
    // const lastMouseDndPosition = useRef<[number, number] | null>(null);
    // const [activeId, setActiveId] = useState<UniqueIdentifier | null>();
    const [activeDraggableItem, setActiveDraggableItem] = useState<Active | null>();
    const [clonedItems, setClonedItems] = useState<FlowDesignerUIBlockDescription[] | null>(null);

    const changeScale = useFlowDesignerStore((state) => state.changeScale);

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

        //  const uiElements = blocks.map(block => block.elements).flat(1);
        // const uiElementIds = uiElements.map(e=>e.id);

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



    // const handleDragEnd = useCallback((event: DragEndEvent) => {
    //     const { active, over } = event;

    //     if (over?.data.current?.accepts.includes(active.data.current?.type)) {
    //         if (isNil(lastMouseDndPosition.current)) {
    //             throw new Error('Property "lastMouseDndPosition" can not be null here.')
    //         }
    //         if (isNil(flowDesignerTransformDescription.current)) {
    //             throw new Error('Property "flowDesignerTransformDescription" can not be null here.')
    //         }
    //         if (isNil(event.over)) {
    //             throw new Error('Property "event.over" can not be null here.')
    //         }

    //         const newBlockPosition = {
    //             x: round((lastMouseDndPosition.current[0] - event.over.rect.left - flowDesignerTransformDescription.current.x) * (1 / flowDesignerTransformDescription.current.scale)),
    //             y: round((lastMouseDndPosition.current[1] - event.over.rect.top - flowDesignerTransformDescription.current.y) * (1 / flowDesignerTransformDescription.current.scale)),
    //         };



    //         const updatedBlocks = [...blocks, {
    //             id: (blocks.length + 1).toString(), position: newBlockPosition, elements: generateElements()
    //         }];
    //         setBlocks(updatedBlocks)
    //     }

    //     dragMode.current = false;

    // }, [blocks])

    // const handleDragStart = useCallback(() => {
    //     dragMode.current = true;
    // }, []);

    const handleTransformDescriptionChange = useCallback((newValue: TransformDescription) => {
        if (flowDesignerTransformDescription.current?.scale !== newValue.scale) {
            changeScale(newValue.scale);
        }

        flowDesignerTransformDescription.current = newValue;
    }, [changeScale])

    // const mouseMoveBind = useMove((state) => {
    //     if (dragMode.current === false) {
    //         return;
    //     }

    //     lastMouseDndPosition.current = state.values;
    // });

    const handleBlocksUpdate = (newBlocks: FlowDesignerUIBlockDescription[]) => {
        setBlocks(newBlocks);
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
        // console.log('drag end');

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



        // for (const block of blocks) {

        //     for (const element of block.elements) {
        //         if (needToChangeId(element.type)) {
        //             // const prev = element;
        //             // const index = block.elements.indexOf(element);
        //             // block.elements[index] = 
        //             // element.id = element.id + '-' + v4();
        //             console.log('newId:' + element.id);
        //             newBlocks = [...blocks];
        //         }
        //     }
        // }

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
        // console.log('handleDragStart');

        const { active } = event;
        // const { id } = active;

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

            // console.log('ADD NEW ELEMENT', activeElement);

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
        <Box sx={{ padding: (theme) => theme.spacing(2), height: '100%', display: 'flex', flexDirection: 'row' }} /*{...mouseMoveBind()}*/>
            {/* <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} modifiers={[restrictToWindowEdges]}> */}
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
                {/* <ToolBox /> */}
                <Box sx={{ flex: 1 }}>
                    <FlowDesigner
                        blocks={blocks}
                        onTransformDescriptionChange={handleTransformDescriptionChange}
                        onUpdateBlocks={handleBlocksUpdate}
                        activeElement={activeElement}
                        setNodeRef={setNodeRef} />
                </Box>
            </DndContext>
            {/* </DndContext> */}
        </Box>
    )
}
