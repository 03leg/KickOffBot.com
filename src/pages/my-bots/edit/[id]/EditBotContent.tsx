import * as React from 'react';
import { Box } from '@mui/material';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useMove } from '@use-gesture/react';
import { useCallback, useRef } from 'react';
import { isNil, round } from 'lodash';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { type TransformDescription } from '~/components/bot/bot-builder/FlowDesigner/types';
import { type ContentTextUIElement, ElementType, type FlowDesignerUIBlockDescription } from '~/components/bot/bot-builder/types';
import { ToolBox } from '~/components/bot/bot-builder/ToolBox';
import { FlowDesigner } from '~/components/bot/bot-builder/FlowDesigner';
import { v4 } from 'uuid';

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
        // { id: '0', position: { x: 0, y: 0 }, elements: generateElements() },
        // { id: '1', position: { x: 0, y: 500 }, elements: generateElements() },
        // { id: '2', position: { x: 500, y: 300 }, elements: generateElements() },
    ]);
    const dragMode = useRef<boolean>(false);
    const lastMouseDndPosition = useRef<[number, number] | null>(null);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (over?.data.current?.accepts.includes(active.data.current?.type)) {
            if (isNil(lastMouseDndPosition.current)) {
                throw new Error('Property "lastMouseDndPosition" can not be null here.')
            }
            if (isNil(flowDesignerTransformDescription.current)) {
                throw new Error('Property "flowDesignerTransformDescription" can not be null here.')
            }
            if (isNil(event.over)) {
                throw new Error('Property "event.over" can not be null here.')
            }

            const newBlockPosition = {
                x: round((lastMouseDndPosition.current[0] - event.over.rect.left - flowDesignerTransformDescription.current.x) * (1 / flowDesignerTransformDescription.current.scale)),
                y: round((lastMouseDndPosition.current[1] - event.over.rect.top - flowDesignerTransformDescription.current.y) * (1 / flowDesignerTransformDescription.current.scale)),
            };



            const updatedBlocks = [...blocks, {
                id: (blocks.length + 1).toString(), position: newBlockPosition, elements: generateElements()
            }];
            setBlocks(updatedBlocks)
        }

        dragMode.current = false;

    }, [blocks])

    const handleDragStart = useCallback(() => {
        dragMode.current = true;
    }, []);

    const handleTransformDescriptionChange = useCallback((newValue: TransformDescription) => {
        flowDesignerTransformDescription.current = newValue;
    }, [])

    const mouseMoveBind = useMove((state) => {
        if (dragMode.current === false) {
            return;
        }

        lastMouseDndPosition.current = state.values;
    });

    const handleBlocksUpdate = (newBlocks: FlowDesignerUIBlockDescription[]) => {
        setBlocks(newBlocks);
    }

    return (
        <Box sx={{ padding: (theme) => theme.spacing(2), height: '100%', display: 'flex', flexDirection: 'row' }} {...mouseMoveBind()}>
            <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} modifiers={[restrictToWindowEdges]}>
                <ToolBox />
                <Box sx={{ flex: 1 }}>
                    <FlowDesigner blocks={blocks} onTransformDescriptionChange={handleTransformDescriptionChange} onUpdateBlocks={handleBlocksUpdate} />
                </Box>
            </DndContext>
        </Box>
    )
}
