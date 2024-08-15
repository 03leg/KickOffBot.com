import { ElementType, FlowDesignerUIBlockDescription } from '@kickoffbot.com/types';
import React from 'react';
import { TelegramStartCommandsElement } from './TelegramStartCommandsElement';
import { WebStartCommandsElement } from './WebStartCommandsElement';

interface Props {
    blockDescription: FlowDesignerUIBlockDescription;
}

export const StartCommandsBlock = ({ blockDescription }: Props) => {
    return (
        <>
            {blockDescription.elements[0]?.type === ElementType.TELEGRAM_START_COMMANDS && <TelegramStartCommandsElement blockDescription={blockDescription} />}
            {blockDescription.elements[0]?.type === ElementType.WEB_START_COMMANDS && <WebStartCommandsElement blockDescription={blockDescription} />}
        </>
    )
}
