import React from 'react'
import { useThemeSelectorStyles } from './ThemeSelector.style';
import { Box } from '@mui/material';
import BackgroundEditor from './components/BackgroundEditor/BackgroundEditor';
import SettingsGroup from './components/SettingsGroup/SettingsGroup';
import UserAvatarSettingsEditor from './components/UserAvatarSettingsEditor/UserAvatarSettingsEditor';
import BotAvatarSettingsEditor from './components/BotAvatarSettingsEditor/BotAvatarSettingsEditor';
import BotMessageEditor from './components/BotMessageEditor/BotMessageEditor';
import UserMessageEditor from './components/UserMessageEditor/UserMessageEditor';
import MainColorsEditor from './components/MainColorsEditor/MainColorsEditor';
import PaperColorEditor from './components/PaperColorEditor/PaperColorEditor';


export default function ThemeSelector() {
    const { classes } = useThemeSelectorStyles();

    return (
        <Box className={classes.root}>
            <SettingsGroup label='Main Colors'>
                <MainColorsEditor />
            </SettingsGroup>
            <SettingsGroup label='Chat Background'>
                <BackgroundEditor />
            </SettingsGroup>
            <SettingsGroup label='Paper Color'>
                <PaperColorEditor />
            </SettingsGroup>
            <SettingsGroup label='Bot Message'>
                <BotMessageEditor />
            </SettingsGroup>
            <SettingsGroup label='User Message'>
                <UserMessageEditor />
            </SettingsGroup>
            <SettingsGroup label='Bot Avatar'>
                <BotAvatarSettingsEditor />
            </SettingsGroup>
            <SettingsGroup label='User Avatar'>
                <UserAvatarSettingsEditor />
            </SettingsGroup>
        </Box>
    )
}
