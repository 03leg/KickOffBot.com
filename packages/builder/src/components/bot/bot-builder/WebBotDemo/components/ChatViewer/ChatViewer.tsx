import { BotProject } from '@kickoffbot.com/types';
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useUserChatStore } from '../../store/useUserChatStore';
import { WebBotManager } from '../../runtime/WebBotManager';
import { Box } from '@mui/material';
import { ChatItemType, NormalMessage, RequestDescription } from '../../types';
import { BotMessage } from '../BotMessage';
import { BotRequest } from '../BotRequest';
import { UserMessage } from '../UserMessage';
import { BotTyping } from '../BotTyping';

interface Props {
    project: BotProject;
    height?: number;
}

// let chatManager: ChatManager | null = null;

export const ChatViewer = ({ project, height }: Props) => {
    const chatManager = useRef<WebBotManager | null>(null);
    const lastChildRef = useRef<HTMLDivElement>(null);
    const storeState = useUserChatStore((state) => ({
        ...state,
    }));

    useLayoutEffect(() => {
        if (!chatManager.current && project) {
            chatManager.current = new WebBotManager(project, { ...storeState });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project]);

    const goToBottom = useCallback(() => {
        lastChildRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [])

    useEffect(() => {
        goToBottom();
    }, [storeState.chatItems, storeState.botIsTyping, goToBottom]);

    return (
        <Box sx={{ height: height, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            {storeState.chatItems.map(m => {
                switch (m.itemType) {
                    case ChatItemType.BOT_MESSAGE: {
                        return <BotMessage message={m.content as NormalMessage} key={m.id} onContentHeightChange={goToBottom} />
                    }
                    case ChatItemType.BOT_REQUEST: {
                        return <BotRequest request={m.content as RequestDescription} key={m.id} />
                    }
                    case ChatItemType.USER_MESSAGE: {
                        return <UserMessage message={m.content as NormalMessage} key={m.id} />
                    }
                }
            })}
            {storeState.botIsTyping && <BotTyping />}
            <div ref={lastChildRef}></div>
        </Box>
    )
}
