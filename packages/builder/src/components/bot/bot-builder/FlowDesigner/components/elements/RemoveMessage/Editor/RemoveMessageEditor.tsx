import { RemoveMessageUIElement } from '@kickoffbot.com/types';
import { Box, Typography } from '@mui/material';
import React, { useCallback } from 'react'
import { MessageElementSelector } from '../../EditMessage/Editor/MessageElementSelector';

interface Props {
    element: RemoveMessageUIElement;
}

export const RemoveMessageEditor = ({ element }: Props) => {
    const [selectedMessageElementId, setSelectedMessageElementId] = React.useState<string | undefined>(element.messageElementId);

    const handleMessageElementChange = useCallback((messageId?: string) => {
        setSelectedMessageElementId(messageId);
        element.messageElementId = messageId;
    }, [element]);

    return (
        <Box sx={{ padding: 1 }}>
            <Typography sx={{ marginBottom: 1 }} variant='h6'>Message:</Typography>
            <MessageElementSelector messageElementId={selectedMessageElementId} onChange={handleMessageElementChange} />
        </Box>
    )
}
