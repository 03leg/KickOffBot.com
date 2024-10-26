import React from 'react'
import ThemeFieldEditor from '../ThemeFieldEditor/ThemeFieldEditor'
import ColorPicker from '../ColorPicker/ColorPicker'
import { useThemeDesignerStore } from '../../store/useThemeDesignerStore';

export default function PaperColorEditor() {
    const { setBackground, paperColor } = useThemeDesignerStore((state) => ({
        setBackground: state.setBackground,
        paperColor: state.background.paperColor,
    }));


    return (
        <ThemeFieldEditor label="">
            <ColorPicker color={paperColor} onColorChange={(color) => setBackground({ paperColor: color })} />
        </ThemeFieldEditor>
    )
}
