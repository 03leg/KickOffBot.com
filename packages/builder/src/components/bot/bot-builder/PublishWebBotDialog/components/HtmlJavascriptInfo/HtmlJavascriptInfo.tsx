import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material'
import React from 'react'
import { useHtmlJavascriptInfoStyles } from './HtmlJavascriptInfo.style'
import { CustomTabPanel } from '../CustomTabs/CustomTabs';
import { EmbeddedChatInfo } from './components/EmbeddedChatInfo';
import { EmbeddedButtonsInfo } from './components/EmbeddedButtonsInfo';
import { PopupInfo } from './components/PopupInfo';

interface Props {
    starterUrl: string
    botId: string;
    uniqueId: string
}

export const HtmlJavascriptInfo = ({ starterUrl, botId, uniqueId }: Props) => {
    const { classes } = useHtmlJavascriptInfoStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    return (
        <Box className={classes.root}>
            <ToggleButtonGroup
                color="primary"
                value={value}
                exclusive
                onChange={handleChange}
                className={classes.toggleButtonGroup}
            >
                <ToggleButton value={0} className={classes.toggleButton}>Embedded chat</ToggleButton>
                <ToggleButton value={1} className={classes.toggleButton}>Button(s) -{'>'} Popup with chat</ToggleButton>
                <ToggleButton value={2} className={classes.toggleButton}>Your code -{'>'} Popup with chat</ToggleButton>
            </ToggleButtonGroup>

            <CustomTabPanel value={value} index={0}>
                <EmbeddedChatInfo currentBotId={botId} webStarterUrl={starterUrl} uniqueId={uniqueId} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <EmbeddedButtonsInfo currentBotId={botId} webStarterUrl={starterUrl} uniqueId={uniqueId} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <PopupInfo webStarterUrl={starterUrl} currentBotId={botId} />
            </CustomTabPanel>
        </Box>
    )
}
