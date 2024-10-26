import React from 'react'
import ColorPicker from '../ColorPicker/ColorPicker'
import ThemeFieldEditor from '../ThemeFieldEditor/ThemeFieldEditor';

interface Props {
    backgroundColor: string;
    onBackgroundColorChange: (color: string) => void
    textColor: string;
    onTextColorChange: (color: string) => void
}

export default function MessageAppearanceEditor({ backgroundColor, onBackgroundColorChange, textColor, onTextColorChange }: Props) {
    return (
        <>
            <ThemeFieldEditor label="Background color">
                <ColorPicker color={backgroundColor} onColorChange={(color) => onBackgroundColorChange(color)} />
            </ThemeFieldEditor>
            <ThemeFieldEditor label="Font color">
                <ColorPicker color={textColor} onColorChange={(color) => onTextColorChange(color)} />
            </ThemeFieldEditor>
        </>
    )
}
