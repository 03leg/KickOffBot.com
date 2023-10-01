import React from 'react'
import { type ContentTextUIElement, type UIElement } from '~/components/bot/bot-builder/types';

interface Props {
    element: UIElement;
}

export const TextContent = ({ element }: Props) => {
    const contentTextElement = element as ContentTextUIElement;

    return (
        <div>{contentTextElement.text}</div>
    )
}
