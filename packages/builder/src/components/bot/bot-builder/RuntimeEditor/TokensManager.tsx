import { TelegramToken } from '@kickoffbot.com/types';
import { Box, Button, IconButton, List, ListItemButton, ListItemText, Tooltip, Typography } from '@mui/material'
import { isNil } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react'
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

    }, [onStartBot, selectedToken]);

    const handleStopBot = useCallback(() => {
        if (isNil(selectedToken)) {
            return;
        }

        onStopBot(selectedToken);
    }, [onStopBot, selectedToken]);


    useEffect(() => {
        if (selectedToken) {
            setSelectedToken(tokens.find(t => t.id === selectedToken.id))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokens]);

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
                                {!isNil(selectedToken.requestActiveValue) && <span style={{ color: '#1976d2' }}> In progress... <span style={{ color: 'gray', fontSize: '10px' }}>(Operation can take some time)</span></span>}
                                {isNil(selectedToken.requestActiveValue) &&
                                    <>
                                        {selectedToken.isActiveNow && <span style={{ color: 'green' }}> Active...</span>}
                                        {!selectedToken.isActiveNow && <span style={{ color: 'gray' }}> Not active...</span>}
                                    </>
                                }
                            </Typography>
                        </Box>
                        <Box sx={{ marginTop: 1, display: 'flex', width: '100%' }}>
                            {isNil(selectedToken.requestActiveValue) && <>
                                {!selectedToken.isActiveNow &&
                                    <Button variant="outlined" color='success' startIcon={<PlayCircleFilledIcon />} onClick={handleStartBot}>
                                        Start your bot
                                    </Button>}
                                {selectedToken.isActiveNow &&
                                    <Button variant="outlined" startIcon={<StopIcon />} onClick={handleStopBot}>
                                        Stop your bot
                                    </Button>
                                }
                            </>
                            }
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
