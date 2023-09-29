import * as React from 'react';
import { Box } from '@mui/material';
import Layout from '~/pages/Layout';
import { ToolBox } from '~/components/bot/ToolBox';
import { FlowDesigner } from '~/components/bot/FlowDesigner';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { type FlowDesignerUIBlockDescription } from '~/components/bot/types';
import { type TransformDescription } from '~/components/bot/FlowDesigner/types';

export default function EditPage() {
    const flowDesignerTransformDescription = React.useRef<TransformDescription | null>(null);
    const [blocks, setBlocks] = React.useState<FlowDesignerUIBlockDescription[]>([
        { color: 'orange', position: { x: 0, y: 0 } },
        { color: 'yellow', position: { x: 0, y: 200 } },
        { color: 'green', position: { x: 200, y: 300 } },
    ])

    function handleDragEnd(event: DragEndEvent) {
        const { active, over, activatorEvent } = event;

        if (over?.data.current?.accepts.includes(active.data.current?.type)) {
            const pointerEvent = activatorEvent as PointerEvent;

            const newBlockPosition = {
                x: (((event.delta.x) + pointerEvent.clientX) - (event.over?.rect.left ?? 0)),
                y: ((event.delta.y) + pointerEvent.clientY - (event.over?.rect.top ?? 0)),
            };

            const updatedBlocks = [...blocks, { color: 'black', position: newBlockPosition }];
            setBlocks(updatedBlocks)
        }
    }

    const handleScaleChange = React.useCallback((newValue: TransformDescription) => {
        flowDesignerTransformDescription.current = newValue;
    }, [])


    return (
        <Layout>
            <Box sx={{ padding: (theme) => theme.spacing(2), height: '100%', display: 'flex', flexDirection: 'row' }}>
                <DndContext onDragEnd={handleDragEnd}>
                    <ToolBox />
                    <Box sx={{ flex: 1 }}>
                        <FlowDesigner blocks={blocks} onTransformDescriptionChange={handleScaleChange} />
                    </Box>
                </DndContext>
            </Box>
        </Layout>
    );
}