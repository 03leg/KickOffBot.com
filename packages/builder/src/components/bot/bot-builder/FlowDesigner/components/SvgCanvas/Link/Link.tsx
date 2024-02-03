import React, { useCallback, useMemo } from 'react'
import { keyframes } from 'tss-react';
import { makeStyles } from 'tss-react/mui';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { type FlowDesignerLink } from '@kickoffbot.com/types';
import { Colors } from '~/themes/Colors';
import { getSvgPathForLink } from '../utils';
import { ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useConfirm } from 'material-ui-confirm';


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
    const confirm = useConfirm();

    const { links, viewPortOffset, transformDescription, blocks, selectedLink, selectLink, removeLink } = useFlowDesignerStore((state) => (
        {
            links: state.project.links,
            viewPortOffset: state.viewPortOffset,
            transformDescription: state.project.transformDescription,
            blocks: state.project.blocks,
            selectedLink: state.selectedLink,
            selectLink: state.selectLink,
            removeLink: state.removeLink,
        }));
    const showAnimation = selectedLink === link;

    const handleClick = useCallback(() => {
        selectLink(link);
    }, [link, selectLink]);


    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        handleClick();
        setContextMenu(
            contextMenu === null
                ?
                {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                :
                null,
        );
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleRemoveLink = useCallback(() => {
        handleCloseContextMenu();
        void confirm({ description: "This will permanently delete the link.", title: 'Are you sure?' })
            .then(() => {
                removeLink(link);
            }).catch();

    }, [confirm, link, removeLink]);


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

    const d = useMemo(() => {
        
        return getSvgPathForLink(link, viewPortOffset, transformDescription, inputIndex, outputIndex)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [links, link, transformDescription, viewPortOffset, inputBlock?.position, outputBlock?.position, inputBlock?.elements, outputBlock?.elements, inputIndex, outputIndex]);

    return (
        <>
            <g>
                <path className={cx(classes.link, showAnimation ? classes.linkAnimation : undefined)} stroke={Colors.LINK} fill='none' strokeWidth="3" d={d} ></path >
                <path className={cx(classes.link, showAnimation ? classes.linkAnimation : undefined)}
                    onClick={handleClick}
                    onContextMenu={handleContextMenu}
                    stroke={Colors.LINK} fill="none" strokeWidth="32" d={d} strokeLinecap="round" strokeOpacity="0" ></path>
            </g>
            <Menu
                open={contextMenu !== null}
                onClose={handleCloseContextMenu}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={handleRemoveLink}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Delete link</Typography>
                </MenuItem>
            </Menu>
        </>

    )
}
