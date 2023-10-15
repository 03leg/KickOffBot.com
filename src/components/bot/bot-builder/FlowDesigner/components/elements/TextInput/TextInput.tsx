import React from 'react'
import { type InputTextUIElement, type UIElement } from '~/components/bot/bot-builder/types';

interface Props {
    element: UIElement;
}

export const TextInput = ({ element }: Props) => {
    const contentTextElement = element as InputTextUIElement;

    return (
        <div>{contentTextElement.label}</div>
    )
}
