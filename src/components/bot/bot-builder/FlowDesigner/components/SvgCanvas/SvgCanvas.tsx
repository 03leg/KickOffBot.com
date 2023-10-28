import React from 'react';
import { type TransformDescription } from '../../types';
import { makeStyles } from "tss-react/mui";
import { useFlowDesignerStore } from '../../../store';

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
    const { showTemporaryLink, tempLinkPath } = useFlowDesignerStore((state) => ({ showTemporaryLink: state.showTemporaryLink, tempLinkPath: state.tempLinkPath }));

    return (
        <svg id='svg-container' className={classes.svgViewPort} style={{ transform: `translate(${transformDescription.x}px, ${transformDescription.y}px) scale(${transformDescription.scale})` }}>
            <g>
                {showTemporaryLink && (<g>
                    <path stroke="gray" strokeWidth="3" d={tempLinkPath ?? 'M146.83750915527344 132.1000099182129 C196.83750915527344 132.1000099182129, 359.1000061035156 132.1000099182129, 409.1000061035156 132.1000099182129'}></path>
                </g>)}
            </g>
        </svg>
    )
}
