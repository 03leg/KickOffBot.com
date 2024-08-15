import { ConnectionType, SendTelegramMessageIntegrationUIElement } from '@kickoffbot.com/types';
import { Box, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { ConnectionSelector } from '../../../ConnectionSelector';
import { TextEditor } from '../../TextEditor';
import { isNil } from 'lodash';
import { EditorState, convertFromRaw } from 'draft-js';

interface Props {
    element: SendTelegramMessageIntegrationUIElement;
}

export const IntegrationSendTelegramMessageEditor = ({ element }: Props) => {
    const [connectionId, setConnectionId] = React.useState<string | undefined>(element.connectionId);

    const itemContent = isNil(element.json) ? void 0 : EditorState.createWithContent(convertFromRaw(JSON.parse(element.json)));

    const handleContentChange = useCallback((jsonState: string, htmlContent: string, telegramContent: string) => {
        element.json = jsonState;
        element.htmlContent = htmlContent;
        element.telegramContent = telegramContent;
    }, [element]);

    const handleConnectionIdChange = useCallback((connectionId?: string) => {
        element.connectionId = connectionId;
        setConnectionId(connectionId);
    }, [element]);

    return (
        <Box>
            <ConnectionSelector connectionType={ConnectionType.Telegram} connectionId={connectionId} onConnectionIdChange={handleConnectionIdChange} />
            {connectionId &&
                <Box sx={{ padding: 1 }}>
                    <Typography sx={{ marginBottom: 1 }}>Send next message: </Typography>
                    <TextEditor showInsertTemplateButton={true} onContentChange={handleContentChange} initialState={itemContent} />
                </Box>}
        </Box>
    )
}
