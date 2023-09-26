import { Box } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useStyles } from './FlowDesigner.style'
import { useDrag, useWheel } from '@use-gesture/react';
import { useDebounce } from 'usehooks-ts';

function getScaleMultiplier(delta: number): number {
    const speed = 1;
    const sign = Math.sign(delta);
    const deltaAdjustedSpeed = Math.min(0.25, Math.abs((speed * delta) / 128));
    return 1 - sign * deltaAdjustedSpeed;
}

export const FlowDesigner = () => {

    const [startValue, setStartValue] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [distance, setDistance] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [scale, setScale] = useState<number>(1);


    const bind = useDrag((state) => {
        const [valuesX, valuesY] = state.values;
        const [initialX, initialY] = state.initial;
        const deltaObject = { x: valuesX - initialX, y: valuesY - initialY };

        if (state.down) {
            setDistance(deltaObject);
        }

        if (!state.down) {
            setStartValue({ x: startValue.x + distance.x, y: startValue.y + distance.y });
            setDistance({ x: 0, y: 0 });
        }
    });
    const { classes } = useStyles();

    const bind2 = useWheel((state) => {
        // console.log(state.lastOffset);
        // console.log(state.offset);
        console.log(state);

        console.log(getScaleMultiplier(state.event.deltaY))

        let currentScale = scale;
        if (state.lastOffset[1] < state.offset[1]) {
            if (currentScale > 0)
                currentScale -= 0.1;
        } else {
            if (currentScale < 3)
                currentScale += 0.1
        }

        console.log(currentScale.toFixed(2));

        setScale(+currentScale.toFixed(2));
    });




    return (
        <Box className={classes.root} {...bind()} {...bind2()}>
            <Box className={classes.viewPort} style={{ transform: `translate(${startValue.x + distance.x}px, ${startValue.y + distance.y}px) scale(${scale})` }}>
                <Box sx={{ position: 'absolute', touchAction: 'none', transform: 'translate(0px, 0px)' }}>
                    <Box sx={{ backgroundColor: 'green', height: 100, width: 140 }}></Box>
                </Box>
                <Box sx={{ position: 'absolute', touchAction: 'none', transform: 'translate(200px, 0px)' }}>
                    <Box sx={{ backgroundColor: 'red', height: 100, width: 140 }}></Box>
                </Box>
            </Box>
        </Box>
    )
}
