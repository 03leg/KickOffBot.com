import { TelegramToken } from '@kickoffbot.com/types';
import { Box, Button, IconButton, List, ListItemButton, ListItemText, Tooltip, Typography } from '@mui/material'
import { isNil } from 'lodash';
import React, { useCallback, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import StopIcon from '@mui/icons-material/Stop';

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tokens: TelegramToken[];
    onDelete: (token: TelegramToken) => void;
    onStartBot: (token: TelegramToken) => void;
    onStopBot: (token: TelegramToken) => void;
}

export const TokensManager = ({ tokens, onDelete, onStartBot, onStopBot }: Props) => {
    const [selectedToken, setSelectedToken] = useState<TelegramToken>();

    const handleSelectToken = useCallback((token: TelegramToken) => {
        setSelectedToken(token);
    }, []);


    const handleDeleteButton = useCallback(() => {
        if (isNil(selectedToken)) {
            return;
        }
        setSelectedToken(undefined);
        onDelete(selectedToken);
    }, [onDelete, selectedToken]);

    const handleStartBot = useCallback(() => {
        if (isNil(selectedToken)) {
            return;
        }

        onStartBot(selectedToken);
        setSelectedToken(undefined);

    }, [onStartBot, selectedToken]);

    const handleStopBot = useCallback(() => {
        if (isNil(selectedToken)) {
            return;
        }

        onStopBot(selectedToken);
        setSelectedToken(undefined);

    }, [onStopBot, selectedToken]);

    return (
        <Box sx={{ display: 'flex', backgroundColor: '#F3F6F9', height: '300px', padding: 1, marginTop: 2 }}>
            <Box sx={{ width: '200px', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
                <List dense={true} sx={{ flex: 1, height: 'calc(100% - 55px)', overflowY: 'auto' }}>
                    {tokens.map(token => (
                        <ListItemButton onClick={() => handleSelectToken(token)} selected={selectedToken === token} key={token.id}><ListItemText
                            primary={token.tokenPreview}
                            primaryTypographyProps={{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }} /></ListItemButton>
                    ))}
                </List>
            </Box>
            {!isNil(selectedToken) &&
                (
                    <Box sx={{ flex: 1, backgroundColor: 'white', marginLeft: 1, padding: 1, flexDirection: 'column', display: 'flex', }}>
                        <Box sx={{ width: '100%' }}>
                            <Typography>Status:
                                {selectedToken.isActiveNow && <span style={{ color: 'green' }}> Active...</span>}
                                {!selectedToken.isActiveNow && <span style={{ color: 'gray' }}> Not active...</span>}
                            </Typography>
                        </Box>
                        <Box sx={{ marginTop: 1, display: 'flex', width: '100%' }}>
                            <>
                                {!selectedToken.isActiveNow &&
                                    <Tooltip title="Operation can take some time (at least 30 seconds)">
                                        <Button variant="outlined" color='success' startIcon={<PlayCircleFilledIcon />} onClick={handleStartBot}>
                                            Start your bot
                                        </Button></Tooltip>}
                                {selectedToken.isActiveNow &&
                                    <Tooltip title="Operation can take some time (at least 30 seconds)">
                                        <Button variant="outlined" startIcon={<StopIcon />} onClick={handleStopBot}>
                                            Stop your bot
                                        </Button>
                                    </Tooltip>}
                            </>
                        </Box>

                        <Box sx={{ marginTop: 1, display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            <IconButton
                                aria-label="delete"
                                color="primary"
                                title='Delete'
                                onClick={handleDeleteButton} >
                                <DeleteIcon />
                            </IconButton>
                        </Box>

                    </Box>
                )
            }
        </Box>
    )
}
