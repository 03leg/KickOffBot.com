import { Box, Typography } from '@mui/material'
import React, { useCallback, useContext, useEffect } from 'react'
import { useStyles } from './FlowDesignerBlock.style';
import { useFlowDesignerBlockMovements } from './useFlowDesignerBlockMovements';
import { Colors } from '~/themes/Colors';
import { ElementView } from '../ElementView';
import { BlockType, PortType, type FlowDesignerUIBlockDescription, CommandsUIElement } from '@kickoffbot.com/types';
import { SortableContext } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { flowDesignerVerticalListSortingStrategy } from './flowDesignerVerticalListSortingStrategy';
import { FlowDesignerBlockContext, FlowDesignerContext } from '../../context';
import { APP_ELEMENT_ROLE } from '../../../constants';
import { useFlowDesignerStore } from '../../../store';
import { BlockMenu } from '../BlockMenu/BlockMenu';
import { OutputPort } from '../OutputPort';
import { CommandsViewer } from '../elements/CommandsViewer';


interface Props {
    blockDescription: FlowDesignerUIBlockDescription;
    rootScale: number;
}

export const FlowDesignerBlock = ({ blockDescription, rootScale }: Props) => {
    const { classes } = useStyles();
    const { bind, transformDescription } = useFlowDesignerBlockMovements(blockDescription.position, rootScale);
    const { setNodeRef, node } = useDroppable({
        id: blockDescription.id
    });
    const context = useContext(FlowDesignerContext);
    const { updateBlock } = useFlowDesignerStore((state) => ({
        updateBlock: state.updateBlock
    }));

    const handleBlockClick = useCallback(() => {
        context.setSelectedBlock(blockDescription);
        context.setSelectedElement(null);

    }, [blockDescription, context]);

    useEffect(() => {
        blockDescription.position = { x: transformDescription.x, y: transformDescription.y };
        updateBlock(blockDescription);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transformDescription, updateBlock])

    const selectedBlock = context.selectedBlock === blockDescription;

    return (
        <Box {...bind()} className={classes.root} style={{
            transform: `translate(${transformDescription.x}px, ${transformDescription.y}px)`,
            zIndex: selectedBlock ? 1 : undefined,
        }}>
            <FlowDesignerBlockContext.Provider value={{ blockElement: node }}>
                <Box ref={setNodeRef}
                    data-app-role={APP_ELEMENT_ROLE.block}
                    data-app-id={blockDescription.id}
                    onClick={handleBlockClick} sx={{
                        backgroundColor: Colors.WHITE,
                        border: selectedBlock ? `1px solid ${Colors.SELECTED}` : `1px solid ${Colors.BORDER}`,
                        borderRadius: 1, minHeight: 100, width: 350, padding: 1,
                        position: 'relative',
                        userSelect: 'none',
                    }}>
                    {blockDescription.blockType === BlockType.ELEMENTS &&
                        <>
                            <Box sx={{ pointerEvents: 'none' }}>
                                <Typography sx={{ marginBottom: 1 }} variant='h4'>{blockDescription.title}</Typography>
                            </Box>
                            <SortableContext
                                strategy={flowDesignerVerticalListSortingStrategy(rootScale)}
                                id={blockDescription.id}
                                items={blockDescription.elements.map(e => e.id)}>

                                {blockDescription.elements.map(element => (<ElementView key={element.id} element={element} scale={rootScale} />))}
                            </SortableContext>
                            <OutputPort className={classes.standardBlockPort} blockId={blockDescription.id} outPortType={PortType.BLOCK}/>
                        </>
                    }
                    {blockDescription.blockType === BlockType.COMMANDS &&
                        <>
                            <Box sx={{ height: '100%', display: 'flex' }}>
                                <CommandsViewer blockDescription={blockDescription}/>
                            </Box>
                        </>
                    }
                </Box>
            </FlowDesignerBlockContext.Provider>
            {selectedBlock && blockDescription.blockType === BlockType.ELEMENTS &&
                (
                    <Box sx={{ position: 'absolute', top: 0, left: -50 }}>
                        <BlockMenu block={blockDescription} />
                    </Box>
                )}
        </Box>
    )
}
