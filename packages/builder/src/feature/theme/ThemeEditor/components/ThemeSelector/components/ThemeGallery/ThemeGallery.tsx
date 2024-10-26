import React, { useCallback, useEffect } from 'react'
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { ThemeResponse } from '~/types/Bot';
import { api } from '~/utils/api';
import { useThemeDesignerStore } from '../../store/useThemeDesignerStore';
import ThemeCard from '../ThemeCard/ThemeCard';
import { useThemeGalleryStyles } from './ThemeGallery.style';
import { getUniqueThemeTitle } from './ThemeGallery.utils';

export default function ThemeGallery() {
    const { classes } = useThemeGalleryStyles();
    const router = useRouter();
    const botId = router.query.id as string;
    const { data: themesResponse = { publicThemes: [], userThemes: [], currentThemeId: null }, refetch, isLoading: getThemesLoading } = api.botManagement.getThemes.useQuery({ botId }, {

        enabled: true,
        refetchOnWindowFocus: false,
        // refetchOnMount: true,
        // refetchOnReconnect: false,
        // retry: false,
        // staleTime: 1000 * 60 * 60 * 24,

    });

    const { mutateAsync: applyTheme, isLoading: applyThemeLoading } = api.botManagement.applyTheme.useMutation();
    const { mutateAsync: deleteTheme, isLoading: deleteThemeLoading } = api.botManagement.deleteTheme.useMutation();
    const { applySavedTheme, currentThemeId, editTheme, createTheme } = useThemeDesignerStore((state) => ({
        currentThemeId: state.currentThemeId,
        applySavedTheme: state.applySavedTheme,
        editTheme: state.editTheme,
        createTheme: state.createTheme
    }));

    const handleApplyTheme = useCallback(async (theme: ThemeResponse) => {
        await applyTheme({ themeId: theme.id, botId });
        void refetch();
    }, [applyTheme, botId, refetch]);

    const handleEditTheme = useCallback((theme: ThemeResponse) => {
        editTheme(theme.id, theme.title, JSON.parse(theme.theme as string));
    }, [editTheme]);

    const handleDeleteTheme = useCallback(async (theme: ThemeResponse) => {
        await deleteTheme({ id: theme.id });
        void refetch();
    }, [deleteTheme, refetch]);

    const handleTryTheme = useCallback((theme: ThemeResponse) => {
        applySavedTheme(theme.id, JSON.parse(theme.theme as string));
    }, [applySavedTheme]);

    const handleCreateNewTheme = useCallback(() => {
        createTheme(getUniqueThemeTitle([...themesResponse.publicThemes, ...themesResponse.userThemes]));
    }, [createTheme, themesResponse.publicThemes, themesResponse.userThemes]);


    useEffect(() => {
        if (themesResponse.currentThemeId) {
            const actualTheme = [...themesResponse.publicThemes, ...themesResponse.userThemes].find(theme => theme.id === themesResponse.currentThemeId);

            if (actualTheme && actualTheme.theme) {
                applySavedTheme(themesResponse.currentThemeId, JSON.parse(actualTheme.theme as string));
            }
        }
    }, [applySavedTheme, themesResponse.currentThemeId, themesResponse.publicThemes, themesResponse.userThemes]);

    const isViewLoading = getThemesLoading || applyThemeLoading || deleteThemeLoading;

    if (isViewLoading) {
        return <Box className={classes.root}><LinearProgress sx={{ marginTop: 3 }} /></Box>
    }

    return (
        <Box className={classes.root}>
            <Box className={classes.toolbar}>
                <Button variant='contained' onClick={handleCreateNewTheme}>Create New Theme</Button>
            </Box>
            {themesResponse.publicThemes.length > 0 && <>
                <Typography className={classes.header} variant='h5'>Public Themes</Typography>
                <Box className={classes.themes}>
                    {themesResponse.publicThemes.map(theme => <ThemeCard key={theme.id}
                        theme={theme} isPublic
                        isApplied={theme.id === themesResponse.currentThemeId}
                        isSelected={currentThemeId === theme.id}
                        onApplyTheme={handleApplyTheme}
                        onTryTheme={handleTryTheme}
                        onEditTheme={handleEditTheme} />)}
                </Box>
            </>}

            {themesResponse.userThemes.length > 0 &&
                <>
                    <Typography className={classes.header} variant='h5'>Yours Themes</Typography>
                    <Box className={classes.themes}>
                        {themesResponse.userThemes.map(theme => <ThemeCard key={theme.id}
                            isApplied={theme.id === themesResponse.currentThemeId}
                            theme={theme}
                            isSelected={currentThemeId === theme.id}
                            isPublic={false}
                            onTryTheme={handleTryTheme}
                            onApplyTheme={handleApplyTheme}
                            onEditTheme={handleEditTheme}
                            onDeleteTheme={handleDeleteTheme} />)}
                    </Box>
                </>}
        </Box>
    )
}
