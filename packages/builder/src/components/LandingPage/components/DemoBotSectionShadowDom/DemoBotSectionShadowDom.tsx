import { Box, Button } from '@mui/material'
import React, { useLayoutEffect } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import TabIcon from '@mui/icons-material/Tab';

interface Props {
    header: string;
    googleSpreadsheetUrl: string;
    botId: string;
    botUrl: string;
}

export const DEMO_BOT_CONTAINER_ID = 'demo-bot-container' as const;

export default function DemoBotSectionShadowDom({ header, googleSpreadsheetUrl, botId, botUrl }: Props) {
    const [googleSheetKey, setGoogleSheetKey] = React.useState('initial-key');
    const isInitialized = React.useRef(false);

    useLayoutEffect(() => {
        if (!window.KickOffBot) {
            console.error('KickOffBot not found!')
            return;
        }

        if (isInitialized.current) {
            return;
        }

        window.KickOffBot.renderEmbeddedChat({
            containerId: `${DEMO_BOT_CONTAINER_ID}-${botId}`,
            botId: botId,
        });

        isInitialized.current = true
    }, [botId]);

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
                    <Box
                        id={`${DEMO_BOT_CONTAINER_ID}-${botId}`}
                        sx={(theme) => ({
                            border: "1px solid #d5d9df",
                            height: "100%",
                        })}>

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
