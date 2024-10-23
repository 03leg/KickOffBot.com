import React, { useCallback } from 'react'
import ThemeFieldEditor from '../ThemeFieldEditor/ThemeFieldEditor'
import ColorPicker from '../ColorPicker/ColorPicker'
import { useThemeDesignerStore } from '../../store/useThemeDesignerStore';
import { getContrastRatio } from '@mui/material';

export default function MainColorsEditor() {
    const { main, contrastText, setPrimaryColors } = useThemeDesignerStore((state) => ({
        main: state.primaryColors.main,
        contrastText: state.primaryColors.contrastText,
        setPrimaryColors: state.setPrimaryColors
    }));

    const handleMainColorChange = useCallback((color: string) => {
        const contrastText = getContrastRatio(color, '#ffffff') > 4.5 ? '#fff' : '#111';
        setPrimaryColors({ main: color, contrastText });
    }, [setPrimaryColors]);

    return (
        <>
            <ThemeFieldEditor label="Main color">
                <ColorPicker color={main} onColorChange={handleMainColorChange} />
            </ThemeFieldEditor>
            <ThemeFieldEditor label="Contrast text">
                <ColorPicker color={contrastText} onColorChange={(color) => setPrimaryColors({ contrastText: color })} />
            </ThemeFieldEditor>
        </>
    )
}
