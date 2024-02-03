import { Box } from '@mui/material'
import { useGesture } from '@use-gesture/react';
import React, { useContext, useMemo, useRef } from 'react'
import { Colors } from '~/themes/Colors'
import { useFlowDesignerStore } from '../../../store';
import { getBlockBoundingClientRect, getSvgPathForTempLine } from './utils';
import { isNil } from 'lodash';
import { APP_ELEMENT_ROLE } from '../../../constants';
import { FlowDesignerBlockContext } from '../../context';
import { v4 } from 'uuid';
import { type ButtonPortDescription } from '@kickoffbot.com/types';
import { type CoordinateDescription } from '../../types';

interface Props {
    className: string;
    blockId?: string;
    elementId?: string;
    buttonId?: string;
}

export const OutputPort = ({ className, buttonId, elementId, blockId }: Props) => {
    const { showTempLink, hideTempLink, setTempLinkPath, transformDescription, viewPortOffset, addLink } = useFlowDesignerStore((state) => ({
        showTempLink: state.showTempLink,
        hideTempLink: state.hideTempLink,
        setTempLinkPath: state.setTempLinkPath,
        viewPortOffset: state.viewPortOffset,
        transformDescription: state.project.transformDescription,
        addLink: state.addLink
    }));

    const blockContext = useContext(FlowDesignerBlockContext);
    const blockCoordinates = useRef<CoordinateDescription>();


    const bind = useGesture({
        onDrag: (e) => {
            if (isNil(blockCoordinates.current)) {
                throw new Error('InvalidOperationError');
            }

            const path = getSvgPathForTempLine(transformDescription, e.initial, e.values, viewPortOffset, blockCoordinates.current);
            setTempLinkPath(path);
        },
        onDragStart: (e) => {
            e.event.stopPropagation();
            // const [initialX, initialY] = e.initial;
            // console.log(initialX, initialY);

            if (isNil(blockContext.blockElement) || isNil(blockContext.blockElement.current)) {
                throw new Error('InvalidOperationError');
            }

            blockCoordinates.current = getBlockBoundingClientRect(
                blockContext.blockElement.current,
                viewPortOffset,
                transformDescription
            );

            showTempLink();
        },
        onDragEnd: (e) => {
            hideTempLink();

            const x = (e.values[0]); //* (1 / scale);
            const y = (e.values[1]);// * (1 / scale);


            const el = document.elementFromPoint(x, y);
            if (!isNil(el)) {
                const block = el.closest(`[data-app-role="${APP_ELEMENT_ROLE.block}"]`);

                if (isNil(block)) {
                    return;
                }

                const blockId = block.getAttribute('data-app-id');

                if (isNil(blockId)) {
                    throw new Error('InvalidOperationError');
                }

                const outputBlock = blockContext.blockElement?.current;
                const outputBlockId = outputBlock?.getAttribute('data-app-id');

                addLink({ id: v4(), input: { blockId }, output: { blockId: outputBlockId, buttonId, elementId } as ButtonPortDescription })
            }

            // console.log(el);
        },
    });

    const outputPortId = useMemo(() => {
        if (!isNil(buttonId)) {
            return buttonId;
        }

        if (!isNil(blockId)) {
            return blockId;
        }

        throw new Error('InvalidOperationError');
    }, [blockId, buttonId])

    return (
        <Box {...bind()}
            data-app-id={buttonId}
            data-app-output-port={outputPortId}
            className={className}
            sx={{
                height: 16,
                width: 16,
                borderRadius: 8,
                backgroundColor: Colors.OUTPUT,
                border: `2px solid ${Colors.BORDER}`,
                touchAction: 'none'
            }}></Box>
    )
}
