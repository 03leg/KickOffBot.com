import { ContentTextUIElement, EditMessageUIElement } from '@kickoffbot.com/types';
import React, { useCallback } from 'react'
import { MessageElementSelector } from './MessageElementSelector';
import { TextContentEditor } from '../../TextContent/Editor';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { Box, Typography } from '@mui/material';
import { isNil } from 'lodash';

interface Props {
    element: EditMessageUIElement;
}


export const EditMessageEditor = ({ element }: Props) => {
    const [selectedMessageElementId, setSelectedMessageElementId] = React.useState<string | undefined>(element.messageElementId);
    const { blocks } = useFlowDesignerStore((state) => ({
        blocks: state.project.blocks
    }));

    const handleMessageElementChange = useCallback((messageId?: string) => {
        setSelectedMessageElementId(messageId);
        element.messageElementId = messageId;

        if (isNil(messageId)) {
            element.editedMessage = undefined;
        }
        else {
            const messageElement = blocks.map(b => b.elements).flat(1).find(e => e.id === messageId) as ContentTextUIElement;

            const copyMessageElement = JSON.parse(JSON.stringify(messageElement));
            element.editedMessage = copyMessageElement;
        }
    }, [blocks, element]);

    return (
        <Box sx={{ padding: 1 }}>
            <Typography sx={{ marginBottom: 1 }} variant='h6'>Message:</Typography>
            <MessageElementSelector messageElementId={selectedMessageElementId} onChange={handleMessageElementChange} />
            {selectedMessageElementId && element.editedMessage &&
                <Box sx={{ marginTop: 1 }}>
                    <Typography sx={{ marginBottom: 1 }} variant='h6'>New content:</Typography>
                    <TextContentEditor key={selectedMessageElementId} element={element.editedMessage} />
                </Box>
            }
        </Box>
    )
}
