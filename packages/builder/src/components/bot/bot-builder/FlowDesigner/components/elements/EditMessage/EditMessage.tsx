import { EditMessageUIElement, FlowDesignerUIBlockDescription, UIElement } from '@kickoffbot.com/types';
import { Box, Divider } from '@mui/material';
import { isNil } from 'lodash';
import React, { useCallback } from 'react';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { TextContent } from '../TextContent';

interface Props {
    element: UIElement;
}

export const getBlockFromMessageElementId = (messageElementId: string | undefined, blocks: FlowDesignerUIBlockDescription[]) => {
    if (isNil(messageElementId)) {
        return undefined;
    }


    return blocks.find(b => b.elements.some(e => e.id === messageElementId)) ?? undefined;
}

export const EditMessage = ({ element }: Props) => {
    const editMessageElement = element as EditMessageUIElement;
    const { blocks } = useFlowDesignerStore((state) => ({
        blocks: state.project.blocks
    }));

    const getEditTitle = useCallback((messageElementId: string) => {
        const block = getBlockFromMessageElementId(messageElementId, blocks);
        if (isNil(block)) {
            return 'Error... Edit message from unknown block';
        }

        return 'Edit ' + (block.elements.findIndex(e => e.id === messageElementId) + 1) + ' message from "' + block.title + '"';
    }, [blocks]);

    return (
        <>
            {!editMessageElement.messageElementId && <div>Configure message editing...</div>}
            {editMessageElement.messageElementId &&
                <>
                    <Box sx={{ fontWeight: 'bold' }}>{getEditTitle(editMessageElement.messageElementId)}</Box>
                    <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                    {editMessageElement.editedMessage && <TextContent element={editMessageElement.editedMessage} elementId={editMessageElement.id} />}
                </>
            }
        </>
    )
}
