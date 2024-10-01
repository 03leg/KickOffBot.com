import { BotMessageBody, BotProject, ChatItemTypeWebRuntime, RequestDescriptionWebRuntime } from '@kickoffbot.com/types';
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useUserChatStore } from '../../store/useUserChatStore';
import { Box } from '@mui/material';
import { BotMessage } from '../BotMessage';
import { BotRequest } from '../BotRequest';
import { UserMessage } from '../UserMessage';
import { BotTyping } from '../BotTyping';
import { WebRuntimeConnector } from '../../connector/WebRuntimeConnector';

interface Props {
    project?: BotProject;
    height?: number | string;
    projectId: string;
}

// let chatManager: ChatManager | null = null;

export const ChatViewer = ({ project, height, projectId }: Props) => {
    const runtimeConnector = useRef<WebRuntimeConnector | null>(null);
    const lastChildRef = useRef<HTMLDivElement>(null);
    const storeState = useUserChatStore((state) => ({
        ...state,
    }));

    useLayoutEffect(() => {
        if (!runtimeConnector.current) {
            runtimeConnector.current = new WebRuntimeConnector(project, projectId, { ...storeState });

            void runtimeConnector.current.connect();
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
        <Box sx={{ height: height, overflow: 'auto', display: 'flex', flexDirection: 'column' }} data-testid="chat-viewer">
            {storeState.chatItems.map(m => {
                switch (m.itemType) {
                    case ChatItemTypeWebRuntime.BOT_MESSAGE: {
                        return <BotMessage message={m.content as BotMessageBody} key={m.id} onContentHeightChange={goToBottom} />
                    }
                    case ChatItemTypeWebRuntime.BOT_REQUEST: {
                        return <BotRequest request={m.content as RequestDescriptionWebRuntime} key={m.id} />
                    }
                    case ChatItemTypeWebRuntime.USER_MESSAGE: {
                        return <UserMessage responseBody={m.content as BotMessageBody} key={m.id} />
                    }
                }
            })}
            {storeState.botIsTyping && <BotTyping />}
            <div ref={lastChildRef}></div>
        </Box>
    )
}
