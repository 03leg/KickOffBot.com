import React, { useEffect } from 'react'
import { useThemeDesignerStore } from './store/useThemeDesignerStore';
import ThemeGallery from './components/ThemeGallery/ThemeGallery';
import ThemeEditor from './components/ThemeEditor/ThemeEditor';



export default function ThemeSelector() {
    const { mode, resetState } = useThemeDesignerStore((state) => ({
        mode: state.mode,
        resetState: state.resetState
    }));

    useEffect(() => {
        return () => resetState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {mode === 'view' && <ThemeGallery />}
            {mode === 'edit' && <ThemeEditor />}
        </>
    )
}
