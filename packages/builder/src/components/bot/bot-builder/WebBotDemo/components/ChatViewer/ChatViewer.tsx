import { BotMessageBody, BotProject, ChatItemTypeWebRuntime, RequestDescriptionWebRuntime } from '@kickoffbot.com/types';
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useUserChatStore } from '../../store/useUserChatStore';
import { Box } from '@mui/material';
import { BotMessage } from '../BotMessage';
import { BotRequest } from '../BotRequest';
import { UserMessage } from '../UserMessage';
import { BotTyping } from '../BotTyping';
import { WebRuntimeConnector } from '../../connector/WebRuntimeConnector';
import { ErrorMessages } from '../ErrorMessages';

interface Props {
    project?: BotProject;
    height?: number | string;
    projectId: string;
}

export const ChatViewer = ({ project, height, projectId }: Props) => {
    const runtimeConnector = useRef<WebRuntimeConnector | null>(null);
    const messageListRef = useRef<HTMLDivElement>(null);
    const storeState = useUserChatStore((state) => ({
        ...state,
    }));

    useLayoutEffect(() => {
        if (!runtimeConnector.current && (projectId || project)) {
            runtimeConnector.current = new WebRuntimeConnector(project, projectId, { ...storeState });

            void runtimeConnector.current.connect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project, projectId]);

    const goToBottom = useCallback(() => {
        const messageList = messageListRef.current;
        if (!messageList) {
            return;
        }
        const scrollHeight = messageList.scrollHeight;
        const height = messageList.clientHeight;
        const maxScrollTop = scrollHeight - height;
        
        messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }, [])

    useEffect(() => {
        goToBottom();
    }, [storeState.chatItems, storeState.botIsTyping, goToBottom]);

    return (
        <Box ref={messageListRef} sx={{ height: height, overflow: 'auto', display: 'flex', flexDirection: 'column' }} data-testid="chat-viewer">
            {storeState.chatItems.map(m => {
                switch (m.itemType) {
                    case ChatItemTypeWebRuntime.BOT_MESSAGE: {
                        return <BotMessage message={m.content as BotMessageBody} onContentHeightChange={goToBottom} key={m.id} />
                    }
                    case ChatItemTypeWebRuntime.BOT_REQUEST: {
                        return <BotRequest request={m.content as RequestDescriptionWebRuntime} onContentHeightChange={goToBottom} key={m.id} />
                    }
                    case ChatItemTypeWebRuntime.USER_MESSAGE: {
                        return <UserMessage responseBody={m.content as BotMessageBody} key={m.id} />
                    }
                }
            })}
            {storeState.botIsTyping && <BotTyping />}
            {storeState.errorMessages.length > 0 && <ErrorMessages errorMessages={storeState.errorMessages} />}
        </Box>
    )
}
