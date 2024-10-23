import React from 'react'
import { useThemeDesignerStore } from '../../store/useThemeDesignerStore';
import MessageAppearanceEditor from '../MessageAppearanceEditor/MessageAppearanceEditor';

export default function UserMessageEditor() {
    const { backgroundColor, textColor, setUserMessageAppearance } = useThemeDesignerStore((state) => ({
        backgroundColor: state.userMessageAppearance.backgroundColor,
        setUserMessageAppearance: state.setUserMessageAppearance,
        textColor: state.userMessageAppearance.textColor
    }));

    return (
        <>
            <MessageAppearanceEditor backgroundColor={backgroundColor} onBackgroundColorChange={(color) => setUserMessageAppearance({ backgroundColor: color })}
                textColor={textColor} onTextColorChange={(color) => setUserMessageAppearance({ textColor: color })}
            />
        </>
    )
}
