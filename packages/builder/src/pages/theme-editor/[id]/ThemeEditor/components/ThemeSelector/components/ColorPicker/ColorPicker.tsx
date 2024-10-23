import { Box, ClickAwayListener } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useColorPickerStyles } from './ColorPicker.style';
import { ColorResult, SketchPicker } from 'react-color';

interface Props {
    color?: string;
    onColorChange: (color: string) => void;
}

export default function ColorPicker({ color, onColorChange }: Props) {

    const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
    const { classes } = useColorPickerStyles();

    const handleColorChange = useCallback((arg: ColorResult) => {
        console.log('hex', arg.hex)
        onColorChange(arg.hex);
    }, [onColorChange]);

    return <>
        <Box className={classes.root} sx={{ border: '1px solid gray', borderRadius: 1, padding: 0.5 }} onClick={() => setShowColorPicker(true)}>
            <Box sx={{ height: '100%', width: '100%', padding: 1, backgroundColor: color, }}></Box>
            {showColorPicker &&
                <ClickAwayListener onClickAway={() => { setShowColorPicker(false); }}>
                    <Box sx={{ position: 'absolute', top: 25, left: -4, zIndex: 2 }}>
                        <SketchPicker disableAlpha presetColors={[
                            "#d32f2f",  // Red
                            "#c2185b",  // Pink
                            "#7b1fa2",  // Purple
                            "#512da8",  // Deep Purple
                            "#303f9f",  // Indigo
                            "#1976d2",  // Blue
                            "#0288d1",  // Light Blue
                            "#0097a7",  // Cyan
                            "#00796b",  // Teal
                            "#388e3c",  // Green
                            "#689f38",  // Light Green
                            "#afb42b",  // Lime
                            "#fbc02d",  // Yellow
                            "#ffa000",  // Amber
                            "#f57c00",  // Orange
                            "#e64a19",  // Deep Orange
                            "#5d4037",  // Brown
                            "#616161",  // Grey
                            "#455a64",   // Blue Grey

                            "#e57373",  // Red
                            "#f48fb1",  // Pink
                            "#ba68c8",  // Purple
                            "#9575cd",  // Deep Purple
                            "#7986cb",  // Indigo
                            "#64b5f6",  // Blue
                            "#81d4fa",  // Light Blue
                            "#80deea",  // Cyan
                            "#4db6ac",  // Teal
                            "#81c784",  // Green
                            "#aed581",  // Light Green
                            "#dce775",  // Lime
                            "#fff176",  // Yellow
                            "#ffe082",  // Amber
                            "#ffb74d",  // Orange
                            "#ff8a65",  // Deep Orange
                            "#a1887f",  // Brown
                            "#e0e0e0",  // Grey
                            "#90a4ae",   // Blue Grey

                            "#ff1744",  // Red
                            "#ff4081",  // Pink
                            "#d500f9",  // Purple
                            "#651fff",  // Deep Purple
                            "#3d5afe",  // Indigo
                            "#2979ff",  // Blue
                            "#00b0ff",  // Light Blue
                            "#00e5ff",  // Cyan
                            "#00e676",  // Green
                            "#76ff03",  // Light Green
                            "#c6ff00",  // Lime
                            "#ffea00",  // Yellow
                            "#ffc400",  // Amber
                            "#ff9100",  // Orange
                            "#ff3d00",  // Deep Orange
                            "#ff6e40",  // Brown
                            "#bdbdbd",  // Grey
                            "#78909c"   // Blue Grey
                        ]} color={color} onChange={handleColorChange} />
                    </Box>
                </ClickAwayListener>}
        </Box>
    </>
}