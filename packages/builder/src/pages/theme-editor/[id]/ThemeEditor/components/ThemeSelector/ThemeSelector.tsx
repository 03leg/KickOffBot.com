import React from 'react'
import { useThemeSelectorStyles } from './ThemeSelector.style';
import { Box } from '@mui/material';
import BackgroundEditor from './components/BackgroundEditor/BackgroundEditor';
import SettingsGroup from './components/SettingsGroup/SettingsGroup';
import UserAvatarSettingsEditor from './components/UserAvatarSettingsEditor/UserAvatarSettingsEditor';
import BotAvatarSettingsEditor from './components/BotAvatarSettingsEditor/BotAvatarSettingsEditor';
import BotMessageEditor from './components/BotMessageEditor/BotMessageEditor';
import UserMessageEditor from './components/UserMessageEditor/UserMessageEditor';


export default function ThemeSelector() {
    const { classes } = useThemeSelectorStyles();

    return (
        <Box className={classes.root}>
            <SettingsGroup label='Chat Background'>
                <BackgroundEditor />
            </SettingsGroup>
            <SettingsGroup label='Bot Avatar'>
                <BotAvatarSettingsEditor />
            </SettingsGroup>
            <SettingsGroup label='User Avatar'>
                <UserAvatarSettingsEditor />
            </SettingsGroup>
            <SettingsGroup label='Bot Message'>
                <BotMessageEditor />
            </SettingsGroup>
            <SettingsGroup label='User Message'>
                <UserMessageEditor />
            </SettingsGroup>
        </Box>
    )
}
