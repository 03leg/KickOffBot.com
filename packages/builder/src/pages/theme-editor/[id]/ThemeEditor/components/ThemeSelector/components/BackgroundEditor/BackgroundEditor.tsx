import React, { useCallback } from 'react'
import ThemeFieldEditor from '../ThemeFieldEditor/ThemeFieldEditor'
import ColorPicker from '../ColorPicker/ColorPicker';
import { useThemeDesignerStore } from '../../store/useThemeDesignerStore';
import ColorSchemaSelector from '../ColorSchemaSelector/ColorSchemaSelector';
import { BackgroundColorSchema } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import BackgroundImageEditor from '../BackgroundImageEditor/BackgroundImageEditor';

export default function BackgroundEditor() {
    const { setBackground, backgroundColorSchema, color1, color2, backgroundImageUrl } = useThemeDesignerStore((state) => ({
        setBackground: state.setBackground,
        color1: state.background.color1,
        color2: state.background.color2,
        backgroundColorSchema: state.background.schema,
        backgroundImageUrl: state.background.imageUrl
    }));

    const handleColor1Change = useCallback((arg: string) => {
        setBackground({
            color1: arg
        })
    }, [setBackground]);

    const handleColor2Change = useCallback((arg: string) => {
        setBackground({
            color2: arg
        })
    }, [setBackground]);


    const handleBackgroundColorSchemaChange = useCallback((schema: BackgroundColorSchema) => {
        let colorLocal1 = color1;
        let colorLocal2 = color2;

        switch (schema) {
            case BackgroundColorSchema.Schema1: {
                colorLocal1 = '#3ebafd';
                colorLocal2 = '#eaf5f7';
                break;
            }
            case BackgroundColorSchema.Schema2: {
                colorLocal1 = '#fceabb';
                colorLocal2 = '#f8b500';
                break;
            }
        }

        setBackground({
            schema: schema,
            color1: colorLocal1,
            color2: colorLocal2
        })
    }, [color1, color2, setBackground]);

    return (
        <>
            <ThemeFieldEditor label="Background mode">
                <ColorSchemaSelector schema={backgroundColorSchema} onChange={handleBackgroundColorSchemaChange} />
            </ThemeFieldEditor>
            {backgroundColorSchema !== BackgroundColorSchema.Image && <ThemeFieldEditor label="Background">
                <Box sx={{ display: 'flex' }}>
                    <ColorPicker color={color1} onColorChange={handleColor1Change} />
                    {backgroundColorSchema !== BackgroundColorSchema.OneColor && <ColorPicker color={color2} onColorChange={handleColor2Change} />}
                </Box>
            </ThemeFieldEditor>}
            {backgroundColorSchema === BackgroundColorSchema.Image && <ThemeFieldEditor label="Background Image">
                <BackgroundImageEditor url={backgroundImageUrl} onChangeUrl={(url) => setBackground({ imageUrl: url })} />
            </ThemeFieldEditor>}
        </>
    )
}
