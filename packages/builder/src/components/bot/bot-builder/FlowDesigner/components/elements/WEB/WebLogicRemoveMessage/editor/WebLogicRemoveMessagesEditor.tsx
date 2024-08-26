import { WebLogicRemoveMessagesUIElement } from '@kickoffbot.com/types';
import React, { useCallback, useState } from 'react';
import { useWebLogicRemoveMessagesEditorStyles } from './WebLogicRemoveMessagesEditor.style';
import { Box, Button, Checkbox, FormControlLabel, IconButton, Typography } from '@mui/material';
import { MessageElementSelector } from '../../../EditMessage/Editor/MessageElementSelector';
import { v4 } from 'uuid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    element: WebLogicRemoveMessagesUIElement;
}

interface RemoveMessageTempObject {
    id: string;
    messageId?: string;
}

export const WebLogicRemoveMessagesEditor = ({ element }: Props) => {
    const { classes } = useWebLogicRemoveMessagesEditorStyles();
    const [removeAllMessages, setRemoveAllMessages] = useState<boolean>(element.removeAllMessages ?? false);
    const [messageIds, setMessagesIds] = useState<RemoveMessageTempObject[]>(element.messageIds?.map(id => ({ id: v4(), messageId: id })) ?? []);

    const handleRemoveAllMessagesChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRemoveAllMessages(event.target.checked);
        element.removeAllMessages = event.target.checked;
        setMessagesIds([]);
    }, [element]);

    const handleMessageElementChange = useCallback((m: RemoveMessageTempObject, messageId?: string) => {
        const obj = messageIds.find(x => x.id === m.id);
        if (obj) {
            obj.messageId = messageId;
        }

        setMessagesIds([...messageIds]);

        element.messageIds = messageIds.filter(x => x.messageId !== undefined).map(x => x.messageId!);

    }, [element, messageIds]);

    const handleRemoveMessage = useCallback((m: RemoveMessageTempObject) => {
        const newItems = messageIds.filter(x => x.id !== m.id);

        setMessagesIds(newItems);
        element.messageIds = newItems.filter(x => x.messageId !== undefined).map(x => x.messageId!);
    }, [element, messageIds]);

    return (
        <Box className={classes.root}>
            <FormControlLabel control={<Checkbox checked={removeAllMessages} onChange={handleRemoveAllMessagesChange} />} label="Remove all messages" />

            {!removeAllMessages && <>
                {messageIds.map((m, index) =>
                    <Box key={m.id} className={classes.message}>
                        <Box className={classes.messageHeader}>
                            <Typography sx={{ marginBottom: 0.5 }} variant='h6'>Message #{index + 1}:</Typography>

                            <IconButton className={classes.deleteButton} onClick={() => handleRemoveMessage(m)} aria-label="delete" size="small">
                                <DeleteIcon fontSize="inherit" />
                            </IconButton>
                        </Box>
                        <MessageElementSelector messageElementId={m.messageId} onChange={(id) => handleMessageElementChange(m, id)} />
                    </Box>
                )}
                <Button startIcon={<AddIcon />} className={classes.addNewMessage} variant="outlined" size="small" onClick={() => setMessagesIds([...messageIds, { id: v4() }])}>
                    Remove message
                </Button>
            </>}
        </Box>

    )
}
