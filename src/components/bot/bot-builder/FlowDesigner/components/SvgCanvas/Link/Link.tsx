import React, { useCallback, useMemo } from 'react'
import { keyframes } from 'tss-react';
import { makeStyles } from 'tss-react/mui';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { type FlowDesignerLink } from '~/components/bot/bot-builder/types';
import { Colors } from '~/themes/Colors';
import { getSvgPathForLink } from '../utils';


interface Props {
    link: FlowDesignerLink;
}

export const useStyles = makeStyles()(() => ({
    link: {
        pointerEvents: 'auto',
    },
    linkAnimation: {
        strokeDasharray: '12, 4',
        animation: `1s linear 0s infinite normal none running ${keyframes`0% { stroke-dashoffset: 32 } 100% { stroke-dashoffset: 0 }`}`,
        stroke: Colors.OUTPUT
    }
}));

export const Link = ({ link }: Props) => {
    const { classes, cx } = useStyles();

    const { links, viewPortOffset, transformDescription, blocks, selectedLink, selectLink } = useFlowDesignerStore((state) => (
        {
            links: state.project.links,
            viewPortOffset: state.viewPortOffset,
            transformDescription: state.project.transformDescription,
            blocks: state.project.blocks,
            selectedLink: state.selectedLink,
            selectLink: state.selectLink
        }));
    const showAnimation = selectedLink === link;


    const { inputBlock, outputBlock } = useMemo(() => {
        const inputBlock = blocks.find(b => b.id === link.input.blockId);
        const outputBlock = blocks.find(b => b.id === link.output.blockId);

        return { inputBlock, outputBlock };

    }, [blocks, link.input.blockId, link.output.blockId]);

    const { inputIndex, outputIndex } = useMemo(() => {
        const inputLinks = links.filter(l => l.input.blockId === link.input.blockId);
        const outputLinks = links.filter(l => l.output.blockId === link.output.blockId);

        return { inputIndex: inputLinks.indexOf(link), outputIndex: outputLinks.indexOf(link) }
    }, [link, links]);

    const handleClick = useCallback(() => {
        // setShowAnimation(!showAnimation);
        selectLink(link);

    }, [link, selectLink]);

    const d = useMemo(() => {
        return getSvgPathForLink(link, viewPortOffset, transformDescription, inputIndex, outputIndex)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [link, transformDescription, viewPortOffset, inputBlock?.position, outputBlock?.position, inputBlock?.elements, outputBlock?.elements, inputIndex, outputIndex]);

    return (
        <g>
            <path className={cx(classes.link, showAnimation ? classes.linkAnimation : undefined)} stroke={Colors.LINK} fill='none' strokeWidth="3" d={d} ></path >
            <path className={cx(classes.link, showAnimation ? classes.linkAnimation : undefined)} onClick={handleClick} stroke={Colors.LINK} fill="none" strokeWidth="32" d={d} strokeLinecap="round" strokeOpacity="0" ></path>
        </g>
    )
}
