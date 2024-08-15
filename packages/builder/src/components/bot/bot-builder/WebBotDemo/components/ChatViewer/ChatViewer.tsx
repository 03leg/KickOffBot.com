import { BotProject } from '@kickoffbot.com/types';
import React, { useLayoutEffect } from 'react';
import { useUserChatStore } from '../../store/useUserChatStore';
import { ChatManager } from '../../runtime/ChatManager';
import { Box } from '@mui/material';
import { ChatItemType } from '../../types';
import { BotMessage } from '../BotMessage';

interface Props {
    project: BotProject;
}

let chatManager: ChatManager | null = null;

export const ChatViewer = ({ project }: Props) => {
    const { messages, sendBotMessage, clearHistory } = useUserChatStore((state) => ({
        messages: state.messages,
        sendBotMessage: state.sendBotMessage,
        clearHistory: state.clearHistory
    }));

    useLayoutEffect(() => {
        if (!chatManager) {
            chatManager = new ChatManager();
        }

        chatManager.init(project, { sendBotMessage, clearHistory });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project])

    return (
        <Box sx={{ height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            {messages.map(m => {
                switch (m.itemType) {
                    case ChatItemType.BOT_MESSAGE: {
                        return <BotMessage message={m.content} key={m.id} />
                    }
                }
            })}
        </Box>
    )
}
