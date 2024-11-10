import { useChatPopupStyles } from './ChatPopup.style';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ChatViewer, KickoffbotChatStoreProvider } from '@kickoffbot.com/web-chat';
import { WebChatTheme } from '@kickoffbot.com/types';

interface Props {
    botId: string;
    chatTheme: WebChatTheme;
    onClose: () => void;
    externalVariables?: Record<string, unknown>;
}

export const ChatPopup = ({ botId, chatTheme, onClose, externalVariables }: Props) => {
    const { classes } = useChatPopupStyles();

    return (
        <Box className={classes.root}>
            <Box className={classes.popup}>
                <Box className={classes.header}>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        className={classes.closeButton}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box className={classes.content}>
                    <KickoffbotChatStoreProvider>
                        <ChatViewer height={"100%"} projectId={botId} webViewOptions={chatTheme} runtimeUrl={process.env.NEXT_PUBLIC_WEB_BOT_RUNTIME_HOST!}
                            externalVariables={externalVariables} />
                    </KickoffbotChatStoreProvider>
                </Box>
            </Box>
        </Box>
    )
}
