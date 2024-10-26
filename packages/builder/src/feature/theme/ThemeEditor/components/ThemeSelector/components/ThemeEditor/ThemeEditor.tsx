import { Box, Button, LinearProgress, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react'
import { api } from '~/utils/api';
import { useThemeDesignerStore } from '../../store/useThemeDesignerStore';
import BackgroundEditor from '../BackgroundEditor/BackgroundEditor';
import BotAvatarSettingsEditor from '../BotAvatarSettingsEditor/BotAvatarSettingsEditor';
import BotMessageEditor from '../BotMessageEditor/BotMessageEditor';
import MainColorsEditor from '../MainColorsEditor/MainColorsEditor';
import PaperColorEditor from '../PaperColorEditor/PaperColorEditor';
import SettingsGroup from '../SettingsGroup/SettingsGroup';
import UserAvatarSettingsEditor from '../UserAvatarSettingsEditor/UserAvatarSettingsEditor';
import UserMessageEditor from '../UserMessageEditor/UserMessageEditor';
import { useThemeEditorStyles } from './ThemeEditor.style';

export default function ThemeEditor() {
    const { classes } = useThemeEditorStyles();
    const router = useRouter();
    const botId = router.query.id as string;
    const { getTheme, currentThemeId, showGallery, themeTitle, changeThemeTitle } = useThemeDesignerStore((state) => ({
        currentThemeId: state.currentThemeId,
        getTheme: state.getTheme,
        showGallery: state.showGallery,
        themeTitle: state.themeTitle,
        changeThemeTitle: state.changeThemeTitle
    }));
    const { mutateAsync: saveTheme, isLoading } = api.botManagement.saveTheme.useMutation();

    const handleSaveTheme = useCallback(async () => {
        await saveTheme({
            themeId: currentThemeId ?? undefined,
            title: themeTitle,
            theme: JSON.stringify(getTheme()),
            botId: botId
        });

        showGallery();

    }, [botId, currentThemeId, getTheme, saveTheme, showGallery, themeTitle]);

    const handleCancel = useCallback(() => {
        showGallery();
    }, [showGallery]);

    const handleThemeNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newThemeName = event.target.value;
        changeThemeTitle(newThemeName);
    }, [changeThemeTitle]);

    if (isLoading) {
        return <Box className={classes.root}><LinearProgress sx={{ marginTop: 3 }} /></Box>
    }

    return (
        <Box className={classes.root}>
            <TextField className={classes.themeName} fullWidth label='Theme Name' value={themeTitle} onChange={handleThemeNameChange} />
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
            <Box className={classes.actionButtons}>
                <Button className={classes.actionButton} variant='contained' color='success' onClick={handleSaveTheme}>Save Theme</Button>
                <Button className={classes.actionButton} variant='outlined' onClick={handleCancel}>Cancel</Button>
            </Box>
        </Box>
    )
}
