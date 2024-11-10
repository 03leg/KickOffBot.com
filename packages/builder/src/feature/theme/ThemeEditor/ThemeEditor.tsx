import { Box } from '@mui/material'
import React from 'react'
import Layout from '~/pages/Layout'
import { useThemeEditorStyles } from './ThemeEditor.style'
import ThemeSelector from './components/ThemeSelector'
import ChatView from './components/ChatView'
import { ConfirmProvider } from 'material-ui-confirm'
import { AppDialogProvider } from '~/components/bot/bot-builder/Dialog/AppDialogProvider'
import { KickoffbotChatStoreProvider } from '@kickoffbot.com/web-chat'


export default function ThemeEditor() {
    const { classes } = useThemeEditorStyles()
    return (
        <AppDialogProvider>
            <ConfirmProvider>
                <Layout>
                    <Box className={classes.root}>
                        <Box className={classes.themeSelectorContainer}>
                            <ThemeSelector />
                        </Box>
                        <Box className={classes.chatContainer}>
                            <KickoffbotChatStoreProvider>
                                <ChatView />
                            </KickoffbotChatStoreProvider>
                        </Box>
                    </Box>
                </Layout>
            </ConfirmProvider>
        </AppDialogProvider>
    )
}
