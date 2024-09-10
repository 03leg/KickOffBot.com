import React, { useCallback, useState } from 'react';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { Box, Button, ClickAwayListener, IconButton } from '@mui/material';
import { ColorResult, SketchPicker } from 'react-color';

export enum CssProperty {
    Color,
    Background
}

interface Props {
    onColorChange: (hexColor: string, property: CssProperty) => void
}

export const ColorPickerButton = ({ onColorChange }: Props) => {
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
    const [color, setColor] = useState('#000000');

    const handleColorClick = useCallback(() => {
        setShowColorPicker(true);
    }, []);

    const handleColorChange = useCallback((arg: ColorResult) => {
        setColor(arg.hex);
    }, []);

    const closeWindow = useCallback((e: React.MouseEvent) => {
        setShowColorPicker(false);
        e.stopPropagation();
    }, []);

    return (
        <IconButton aria-label="color" onClick={handleColorClick}>
            <ColorLensIcon />
            {showColorPicker &&
                <ClickAwayListener
                    onClickAway={() => { setShowColorPicker(false); }}
                ><Box sx={{
                    position: 'fixed',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'white',
                }}>
                        <SketchPicker color={color} onChange={handleColorChange} />
                        <Box sx={{ display: 'flex' }}>
                            <Button sx={{ marginTop: 1, mr: 1, width: '50%' }} variant="outlined" onClick={(e) => {
                                onColorChange(color, CssProperty.Color);
                                closeWindow(e);
                            }}>Text</Button>
                            <Button sx={{ marginTop: 1, width: '50%' }} variant="outlined" onClick={(e) => {
                                onColorChange(color, CssProperty.Background);
                                closeWindow(e);
                            }}>Highlight</Button>
                        </Box>
                    </Box>
                </ClickAwayListener>}
        </IconButton >
    )
}
