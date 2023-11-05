import { Box, IconButton } from '@mui/material'
import React, { useCallback } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { Colors } from '~/themes/Colors';
import { type FlowDesignerUIBlockDescription } from '../../../types';
import { useConfirm } from 'material-ui-confirm';
import { useFlowDesignerStore } from '../../../store';

interface Props {
    block: FlowDesignerUIBlockDescription;
}

export const BlockMenu = ({ block }: Props) => {
    const confirm = useConfirm();

    const { removeBlock } = useFlowDesignerStore((state) => ({
        removeBlock: state.removeBlock
    }));

    const handleRemoveBlock = useCallback(() => {
        void confirm({ description: "This will permanently delete the block.", title: 'Are you sure?' })
            .then(() => {
                removeBlock(block);
            }).catch();
    }, [block, confirm, removeBlock]);

    return (
        <Box sx={{
            display: 'flex',
            backgroundColor: Colors.WHITE,
            borderRadius: 1,
            border: `1px solid ${Colors.BORDER}`, padding: 0.5,
        }}>
            <IconButton size='small' aria-label="delete" onClick={handleRemoveBlock}>
                <DeleteIcon />
            </IconButton>
        </Box>
    )
}
