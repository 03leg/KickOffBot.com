import React, { useCallback, useState } from 'react';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { Box, ClickAwayListener, IconButton } from '@mui/material';
import { ColorResult, SketchPicker } from 'react-color';


interface Props {
    onColorChange: (hexColor: string) => void
}

export const ColorPickerButton = ({ onColorChange }: Props) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [color, setColor] = useState('#000000');

    const handleColorClick = useCallback(() => {
        setShowColorPicker(true);
    }, []);

    const handleColorChange = useCallback((arg: ColorResult) => {
        setColor(arg.hex);
        onColorChange(arg.hex);
    }, [onColorChange]);

    return (
        <IconButton aria-label="color" onClick={handleColorClick}>
            <ColorLensIcon />
            {showColorPicker &&
                <ClickAwayListener
                    onClickAway={() => {
                        setShowColorPicker(false);
                    }}
                ><Box sx={{
                    position: 'fixed',
                    zIndex: 2
                }}>
                        <SketchPicker color={color} onChange={handleColorChange} />
                    </Box>
                </ClickAwayListener>}
        </IconButton>
    )
}
