import { Box } from '@mui/material'
import { useGesture } from '@use-gesture/react';
import React from 'react'
import { Colors } from '~/themes/Colors'
import { useFlowDesignerStore } from '../../../store';
import { getSvgPathForTempLine } from './utils';
import { isNil } from 'lodash';
import { APP_ELEMENT_ROLE } from '../../../constants';

interface Props {
    className: string;
}

export const OutputPort = ({ className }: Props) => {

    const { showTempLink, hideTempLink, setTempLinkPath, scale } = useFlowDesignerStore((state) => ({
        showTempLink: state.showTempLink,
        hideTempLink: state.hideTempLink,
        setTempLinkPath: state.setTempLinkPath,
        scale: state.scale,
    }))

    const bind = useGesture({
        onDrag: (e) => {
            const path = getSvgPathForTempLine(scale, e.initial, e.values);
            setTempLinkPath(path);

            console.log(e);
        },
        onDragStart: (e) => {
            e.event.stopPropagation();
            const [initialX, initialY] = e.initial;
            console.log(initialX, initialY);

            showTempLink();
        },
        onDragEnd: (e) => {
            hideTempLink();

            const x = (e.values[0]); //* (1 / scale);
            const y = (e.values[1]);// * (1 / scale);


            const el = document.elementFromPoint(x, y);
            if (!isNil(el)) {
               const block =  el.closest(`[data-app-role="${APP_ELEMENT_ROLE.block}"]`);
               console.log(block);
            }

            console.log(el);
        },
    })

    return (
        <Box {...bind()}
            className={className}
            sx={{
                height: 16,
                width: 16,
                borderRadius: 8,
                backgroundColor: Colors.OUTPUT,
                border: `2px solid ${Colors.BORDER}`
            }}></Box>
    )
}
