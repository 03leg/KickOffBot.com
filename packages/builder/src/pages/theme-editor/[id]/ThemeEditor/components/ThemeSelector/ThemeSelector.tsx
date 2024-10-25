import React from 'react'
import { useThemeDesignerStore } from './store/useThemeDesignerStore';
import ThemeGallery from './components/ThemeGallery/ThemeGallery';
import ThemeEditor from './components/ThemeEditor/ThemeEditor';



export default function ThemeSelector() {
    const { mode } = useThemeDesignerStore((state) => ({
        mode: state.mode,
    }));

    return (
        <>
            {mode === 'view' && <ThemeGallery />}
            {mode === 'edit' && <ThemeEditor />}
        </>
    )
}
