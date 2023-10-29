import React, { useLayoutEffect, useRef } from 'react';
import { type TransformDescription } from '../../types';
import { makeStyles } from "tss-react/mui";
import { useFlowDesignerStore } from '../../../store';
import { isNil } from 'lodash';

interface Props {
    transformDescription: TransformDescription;
}


export const useStyles = makeStyles()(() => ({
    svgViewPort: {
        height: '100%',
        width: '100%',
        pointerEvents: 'none',
        transformOrigin: '0px 0px',
        position: 'absolute',
        overflow: 'visible',
    }
}));


export const SvgCanvas = ({ transformDescription }: Props) => {
    const { classes } = useStyles();
    const svgRef = useRef<SVGSVGElement>(null);
    const { showTemporaryLink, tempLinkPath, setViewPortOffset } = useFlowDesignerStore((state) => (
        {
            showTemporaryLink: state.showTemporaryLink,
            tempLinkPath: state.tempLinkPath,
            setViewPortOffset: state.setViewPortOffset
        }));

    useLayoutEffect(() => {
        const element = svgRef.current;
        if (isNil(element)) {
            return;
        }

        const rect = element.getBoundingClientRect();
        setViewPortOffset({ x: rect.left, y: rect.top });

    }, [setViewPortOffset])

    return (
        <svg id='svg-container' ref={svgRef} className={classes.svgViewPort} style={{ transform: `translate(${transformDescription.x}px, ${transformDescription.y}px) scale(${transformDescription.scale})` }}>
            <g>
                {showTemporaryLink && (<g>
                    <path stroke="gray" strokeWidth="3" d={tempLinkPath ?? 'M146.83750915527344 132.1000099182129 C196.83750915527344 132.1000099182129, 359.1000061035156 132.1000099182129, 409.1000061035156 132.1000099182129'}></path>
                </g>)}
            </g>
        </svg>
    )
}
