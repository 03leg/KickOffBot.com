import { Alert, Box, Button, TextField } from '@mui/material'
import React, { useCallback } from 'react';
import { api } from '~/utils/api';

interface Props {
    botToken?: string;
    onBotTokenChange: (token: string) => void;

    chatId?: string;
    onChatIdChange: (token: string) => void;
}

export const TelegramConnectionEditor = ({ botToken, onBotTokenChange, chatId, onChatIdChange }: Props) => {
    const { mutateAsync: testTelegramConnection } = api.botManagement.testTelegramConnection.useMutation();

    const handleBotTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onBotTokenChange(event.target.value);
    }

    const handleChatIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChatIdChange(event.target.value);
    }

    const handleSendTestMessage = useCallback(async () => {
        const data = await testTelegramConnection({ botToken: botToken!, targetChatId: chatId! });
        if (data.result) {
            alert('Test message sent successfully!');
        }
        else {
            alert('Failed to send test message!\n' + data.message);
        }
    }, [botToken, chatId, testTelegramConnection]);

    return (
        <Box>
            <TextField fullWidth variant="outlined" required label="Telegram bot token" value={botToken} onChange={handleBotTokenChange} />
            <Alert sx={{ mt: 1 }} severity="warning">You must add the bot with token above to your channel or group, and it needs to have permission to send messages there!</Alert>

            <TextField sx={{ mt: 2 }} fullWidth variant="outlined" required label="Chat Id" value={chatId} onChange={handleChatIdChange} />
            <Alert sx={{ mt: 1 }} severity="warning">Please input the unique identifier for the target chat or the username of the target channel (in the format @channelusername or @supergroupusername).</Alert>

            <Button onClick={handleSendTestMessage} variant="contained" color="success" sx={{ mt: 2 }} disabled={!botToken || !chatId}>Send test message</Button>
        </Box>
    )
}
