import { Button } from '@mui/material';
import React from 'react'
import { type InputButtonsUIElement, type UIElement } from '~/components/bot/bot-builder/types';

interface Props {
    element: UIElement;
}

export const ButtonsInput = ({ element }: Props) => {
    const uiElement = element as InputButtonsUIElement;

    return (
        <div>
            {uiElement.buttons.map(b => (
                <Button sx={{ marginBottom: 1 }} variant="contained" size='small' fullWidth key={b.id} disabled>{b.content}</Button>
            ))}
            <Button variant="contained" size='small' fullWidth disabled>Default</Button>
        </div>
    )
}
