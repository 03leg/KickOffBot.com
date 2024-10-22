import { Box, ClickAwayListener } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useColorPickerStyles } from './ColorPicker.style';
import { ColorResult, TwitterPicker } from 'react-color';

interface Props {
    color?: string;
    onColorChange: (color: string) => void;
}

export default function ColorPicker({ color, onColorChange }: Props) {

    const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
    const { classes } = useColorPickerStyles();

    const handleColorChange = useCallback((arg: ColorResult) => {
        onColorChange(arg.hex);
    }, [onColorChange]);

    return <>
        <Box className={classes.root} sx={{  border: '1px solid gray', borderRadius: 1, padding: 0.5 }} onClick={() => setShowColorPicker(true)}>
            <Box sx={{ height: '100%', width: '100%', padding: 1, backgroundColor: color, }}></Box>
            {showColorPicker &&
                <ClickAwayListener onClickAway={() => { setShowColorPicker(false); }}>
                    <Box sx={{ position: 'absolute', top: 25, left: -4, zIndex: 2 }}>
                        <TwitterPicker color={color} onChange={handleColorChange} />
                    </Box>
                </ClickAwayListener>}
        </Box>
    </>
}