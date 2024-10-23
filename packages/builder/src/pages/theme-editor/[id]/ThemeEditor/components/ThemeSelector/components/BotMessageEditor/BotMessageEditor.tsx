import React from 'react'
import MessageAppearanceEditor from '../MessageAppearanceEditor/MessageAppearanceEditor'
import { useThemeDesignerStore } from '../../store/useThemeDesignerStore';

export default function BotMessageEditor() {
    const { backgroundColor, textColor, setBotMessageAppearance } = useThemeDesignerStore((state) => ({
        backgroundColor: state.botMessageAppearance.backgroundColor,
        setBotMessageAppearance: state.setBotMessageAppearance,
        textColor: state.botMessageAppearance.textColor
    }));

    return (
        <>
            <MessageAppearanceEditor backgroundColor={backgroundColor} onBackgroundColorChange={(color) => setBotMessageAppearance({ backgroundColor: color })}
                textColor={textColor} onTextColorChange={(color) => setBotMessageAppearance({ textColor: color })}
            />
        </>
    )
}
