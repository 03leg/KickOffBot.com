import { Box, Button } from '@mui/material'
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import TabIcon from '@mui/icons-material/Tab';
import TelegramIcon from '@mui/icons-material/Telegram';

interface Props {
    header: string;
    botUrl: string;
    googleSpreadsheetUrl: string;
    botId: string;
    telegramUrl?: string;
}

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        KickOffBot: any;
    }
}

export default function DemoBotSection({ header, botUrl, googleSpreadsheetUrl, botId, telegramUrl }: Props) {
    const [googleSheetKey, setGoogleSheetKey] = React.useState('initial-key');

    return (
        <Box sx={{ width: "100%", }}>
            <Box sx={(theme) => ({
                textAlign: "center",
                fontSize: "1.3rem",
                color: "#4b5563",
                marginBottom: 2,
                [theme.breakpoints.down("md")]: {
                    fontSize: "1rem",
                },
            })}>{header}
                <Box sx={{ marginTop: 1 }}>
                    <Button size='small' variant="outlined" startIcon={<WebAssetIcon />} sx={{ textTransform: "none", mt: 1, }} onClick={() => {
                        if (!window.KickOffBot) {
                            alert('Failed to open in popup!\nPlease try again!');
                            return;
                        }

                        window.KickOffBot.renderChatPopup({ botId });
                    }}>Try it out in popup!</Button>
                    <Button size='small' variant="outlined" startIcon={<TabIcon />} sx={{ ml: 1, mt: 1, textTransform: "none" }} onClick={() => {
                        window.open(botUrl, '_blank', 'noopener,noreferrer');
                    }}>Try it out in new tab!</Button>
                    {telegramUrl && <Button size='small' variant="outlined" startIcon={<TelegramIcon />} sx={{ ml: 1, mt: 1, textTransform: "none" }} onClick={() => {
                        window.open(telegramUrl, '_blank', 'noopener,noreferrer');
                    }}>Telegram</Button>}
                </Box>
            </Box>
            <Box sx={(theme) => ({
                width: "100%",
                display: "flex",
                [theme.breakpoints.down("md")]: {
                    display: "block"
                },
            })}>
                <Box sx={(theme) => ({
                    width: '50%',
                    height: "750px",
                    [theme.breakpoints.down("md")]: {
                        width: '100%',
                        marginRight: "0px",
                        paddingTop: "10px"
                    },
                })}>
                    <Box sx={(theme) => ({
                        border: "1px solid #d5d9df",
                        height: "100%",
                    })}>
                        <iframe
                            src={botUrl}
                            style={{ width: "100%", height: "calc(100% - 1px)", border: "none" }}
                        ></iframe>
                    </Box>
                </Box>
                <Box sx={{ width: "10px", height: "10px" }}></Box>
                <Box sx={(theme) => ({
                    width: 'calc(50% - 10px)',
                    position: "relative",
                    [theme.breakpoints.down("md")]: {
                        width: '100%',
                    },
                    height: "750px"
                })}>
                    <Button
                        color="success"
                        variant="contained"
                        size='small'
                        onClick={() => { setGoogleSheetKey(new Date().getTime().toString()) }}
                        startIcon={<RefreshIcon />}
                        style={{ textTransform: 'none', position: "absolute", top: "5px", right: "3px" }}
                    >Update</Button>

                    <Box sx={{ height: "100%", border: "1px solid #d5d9df", padding: "5px" }}>
                        <iframe key={googleSheetKey} style={{ width: "100%", height: "100%", border: "none" }} src={googleSpreadsheetUrl}></iframe>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
