import * as React from 'react';
import { Box } from '@mui/material';
import Layout from '~/pages/Layout';
import { ToolBox } from '~/components/bot/ToolBox';
import { FlowDesigner } from '~/components/bot/FlowDesigner';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { type FlowDesignerUIBlockDescription } from '~/components/bot/types';
import { type TransformDescription } from '~/components/bot/FlowDesigner/types';
import { useMove } from '@use-gesture/react';
import { useCallback, useRef } from 'react';
import { isNil } from 'lodash';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

export default function EditPage() {
    const flowDesignerTransformDescription = React.useRef<TransformDescription | null>(null);
    const [blocks, setBlocks] = React.useState<FlowDesignerUIBlockDescription[]>([
        { id: '0', color: 'orange', position: { x: 0, y: 0 } },
        { id: '1', color: 'yellow', position: { x: 0, y: 200 } },
        { id: '2', color: 'green', position: { x: 200, y: 300 } },
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

            const newBlockPosition = {
                x: (lastMouseDndPosition.current[0] - (event.over?.rect.left ?? 0) - flowDesignerTransformDescription.current.x) * (1 / flowDesignerTransformDescription.current.scale),
                y: (lastMouseDndPosition.current[1] - (event.over?.rect.top ?? 0) - flowDesignerTransformDescription.current.y) * (1 / flowDesignerTransformDescription.current.scale),
            };

            const updatedBlocks = [...blocks, { id: (blocks.length + 1).toString(), color: 'black', position: newBlockPosition }];
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