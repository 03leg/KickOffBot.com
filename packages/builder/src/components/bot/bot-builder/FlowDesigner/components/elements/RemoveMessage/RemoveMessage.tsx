import { RemoveMessageUIElement, UIElement } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import { isNil } from 'lodash';
import React, { useCallback } from 'react'
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { getBlockFromMessageElementId } from '../EditMessage';

interface Props {
    element: UIElement;
}

export const RemoveMessage = ({ element }: Props) => {
    const removeMessageElement = element as RemoveMessageUIElement;
    const { blocks } = useFlowDesignerStore((state) => ({
        blocks: state.project.blocks
    }));

    const getEditTitle = useCallback((messageElementId: string) => {
        const block = getBlockFromMessageElementId(messageElementId, blocks);
        if (isNil(block)) {
            return 'Error...';
        }

        return 'Remove ' + (block.elements.findIndex(e => e.id === messageElementId) + 1) + ' message from "' + block.title + '"';
    }, [blocks]);

    return (
        <>
            {!removeMessageElement.messageElementId && <div>Configure message removing...</div>}
            {removeMessageElement.messageElementId &&
                <>
                    <Box sx={{ fontWeight: 'bold' }}>{getEditTitle(removeMessageElement.messageElementId)}</Box>
                </>
            }
        </>
    )
}
