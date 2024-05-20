import { Box, Button, TextField } from '@mui/material'
import React, { useCallback } from 'react';
import AddIcon from '@mui/icons-material/Add';

interface Props {
    onAddNewBotToken: (newToken: string) => void;
}

export const NewBotToken = ({ onAddNewBotToken }: Props) => {
    const [newBotToken, setNewBotToken] = React.useState('');

    const handleNewBotTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewBotToken(event.target.value);
    }

    const handleAddNewToken = useCallback(() => {
        onAddNewBotToken(newBotToken);
        setNewBotToken('');
    }, [newBotToken, onAddNewBotToken]);

    return (
        <Box sx={{ width: '100%' }}>
            <TextField fullWidth variant="outlined" required label="Telegram bot token" value={newBotToken} onChange={handleNewBotTokenChange} />

            <Button sx={{ marginTop: 1 }} variant="outlined" startIcon={<AddIcon />} onClick={handleAddNewToken} disabled={!newBotToken}>
                Add telegram bot token
            </Button>
        </Box>
    )
}
