import React from 'react';
import dynamic from 'next/dynamic'

const ThemeEditorComponent = dynamic(() => import('../../../feature/theme/ThemeEditor/ThemeEditor').then(mod => mod.default), {
    ssr: false,
});


export default function ThemeBotPage() {
    return <>
        <ThemeEditorComponent />
    </>
}