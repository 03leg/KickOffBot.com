import * as React from 'react';
import { Box } from '@mui/material';
import Layout from '~/pages/Layout';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useMove } from '@use-gesture/react';
import { useCallback, useRef } from 'react';
import { isNil, round } from 'lodash';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { type TransformDescription } from '~/components/bot/bot-builder/FlowDesigner/types';
import { type ContentTextUIElement, ElementType, type FlowDesignerUIBlockDescription } from '~/components/bot/bot-builder/types';
import { ToolBox } from '~/components/bot/bot-builder/ToolBox';
import { FlowDesigner } from '~/components/bot/bot-builder/FlowDesigner';

export default function EditPage() {
    const flowDesignerTransformDescription = React.useRef<TransformDescription | null>(null);
    const [blocks, setBlocks] = React.useState<FlowDesignerUIBlockDescription[]>([
        { id: '0', position: { x: 0, y: 0 }, elements: [] },
        { id: '1', position: { x: 0, y: 200 }, elements: [] },
        { id: '2', position: { x: 200, y: 300 }, elements: [] },
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

            const textUIElement: ContentTextUIElement = {
                type: ElementType.CONTENT_TEXT,
                text: 'Hello world! Hello world! Hello world! Hello world! Hello world! Hello world! Hello world! Hello world! Hello world! Hello world! Hello world! Hello world! Hello world!',
                id: 'test1'
            };

            const updatedBlocks = [...blocks, {
                id: (blocks.length + 1).toString(), position: newBlockPosition, elements: [
                    textUIElement
                ]
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


    return (
        <Layout>
            <Box sx={{ padding: (theme) => theme.spacing(2), height: '100%', display: 'flex', flexDirection: 'row' }} {...mouseMoveBind()}>
                <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} modifiers={[restrictToWindowEdges]}>
                    <ToolBox />
                    <Box sx={{ flex: 1 }}>
                        <FlowDesigner blocks={blocks} onTransformDescriptionChange={handleTransformDescriptionChange} />
                    </Box>
                </DndContext>
            </Box>
        </Layout>
    );
}