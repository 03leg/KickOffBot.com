import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { makeStyles } from "tss-react/mui";
import { useFlowDesignerStore } from '../../../store';
import { isNil } from 'lodash';
import { getSvgPathForLink } from './utils';

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

function getLinkIndex(map: Map<string, number>, blockId: string, linksCount: number) {
    let resultIndex = 0;

    if (map.has(blockId)) {
        resultIndex = map.get(blockId)!;
        map.set(blockId, resultIndex - 1);
    }
    else {
      
        map.set(blockId, linksCount - 1);
        resultIndex = linksCount;
    }

    return resultIndex;
}


export const SvgCanvas = () => {
    const { classes } = useStyles();
    const svgRef = useRef<SVGSVGElement>(null);
    const { showTemporaryLink, tempLinkPath, setViewPortOffset, links, viewPortOffset, transformDescription } = useFlowDesignerStore((state) => (
        {
            showTemporaryLink: state.showTemporaryLink,
            tempLinkPath: state.tempLinkPath,
            setViewPortOffset: state.setViewPortOffset,
            links: state.project.links,
            viewPortOffset: state.viewPortOffset,
            transformDescription: state.transformDescription,
        }));

    const linkPaths = useMemo(() => {
        const paths: JSX.Element[] = [];

        const mapInputBlock = new Map<string, number>();
        const mapOutputBlock = new Map<string, number>();

        for (const link of links) {
            const inputIndex = getLinkIndex(mapInputBlock, link.input.blockId, links.filter(p => p.input.blockId === link.input.blockId).length);
            const outputIndex = getLinkIndex(mapOutputBlock, link.output.blockId, links.filter(p => p.output.blockId === link.output.blockId).length);

            const path = getSvgPathForLink(link, viewPortOffset, transformDescription, inputIndex, outputIndex);
            paths.push(<g key={link.id}>{path}</g>);
        }

        return paths;
    }, [links, transformDescription, viewPortOffset]);

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
                {linkPaths}
            </g>
        </svg>
    )
}
