import { Box } from '@mui/material'
import React from 'react'
import Layout from '~/pages/Layout'
import { useThemeEditorStyles } from './ThemeEditor.style'
import ThemeSelector from './components/ThemeSelector'
import ChatView from './components/ChatView'


export default function ThemeEditor() {
    const { classes } = useThemeEditorStyles()
    return (
        <Layout>
            <Box className={classes.root}>
                <Box className={classes.themeSelectorContainer}>
                    <ThemeSelector />
                </Box>
                <Box className={classes.chatContainer}>
                    <ChatView />
                </Box>
            </Box>
        </Layout>
    )
}
