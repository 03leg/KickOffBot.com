import { Box, Typography } from '@mui/material'
import React, { useCallback, useContext } from 'react'
import { useStyles } from './FlowDesignerBlock.style';
import { useFlowDesignerBlockMovements } from './useFlowDesignerBlockMovements';
import { Colors } from '~/themes/Colors';
import { ElementView } from '../ElementView';
import { type FlowDesignerUIBlockDescription } from '../../../types';
import { SortableContext } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { flowDesignerVerticalListSortingStrategy } from './flowDesignerVerticalListSortingStrategy';
import { FlowDesignerBlockContext, FlowDesignerContext } from '../../context';
import { APP_ELEMENT_ROLE } from '../../../constants';


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
    const context = useContext(FlowDesignerContext)

    const handleBlockClick = useCallback(() => {
        context.setSelectedBlock(blockDescription);
        context.setSelectedElement(null);

    }, [blockDescription, context]);

    const selectedBlock = context.selectedBlock === blockDescription;

    return (
        <Box {...bind()} className={classes.root} style={{
            transform: `translate(${transformDescription.x}px, ${transformDescription.y}px)`,
            zIndex: selectedBlock ? 1 : undefined,
        }}>
            <FlowDesignerBlockContext.Provider value={{blockElement: node}}>
                <Box ref={setNodeRef}
                    data-app-role={APP_ELEMENT_ROLE.block}
                    data-app-id={blockDescription.id}
                    onClick={handleBlockClick} sx={{
                        backgroundColor: Colors.WHITE,
                        border: selectedBlock ? `1px solid ${Colors.SELECTED}` : `1px solid ${Colors.BORDER}`,
                        boxShadow: selectedBlock ? '0px 2px 4px -1px #c6c9fb, 0px 4px 5px 0px #c7cafb, 0px 1px 10px 0px #c0c2de' : undefined,
                        borderRadius: 1, minHeight: 100, width: 350, padding: 1,
                        position: 'relative'
                    }}>
                    <Box sx={{ pointerEvents: 'none' }}>
                        <Typography sx={{ marginBottom: 1 }} variant='h4'>{blockDescription.title}</Typography>
                    </Box>
                    <SortableContext
                        strategy={flowDesignerVerticalListSortingStrategy(rootScale)}
                        id={blockDescription.id}
                        items={blockDescription.elements.map(e => e.id)}>

                        {blockDescription.elements.map(element => (<ElementView key={element.id} element={element} scale={rootScale} />))}
                    </SortableContext>
                </Box>
            </FlowDesignerBlockContext.Provider>
        </Box>
    )
}
