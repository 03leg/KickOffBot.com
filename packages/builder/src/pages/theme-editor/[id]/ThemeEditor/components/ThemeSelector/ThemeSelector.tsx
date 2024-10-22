import React from 'react'
import { useThemeSelectorStyles } from './ThemeSelector.style';
import { Box } from '@mui/material';
import BackgroundEditor from './components/BackgroundEditor/BackgroundEditor';


export default function ThemeSelector() {
    const { classes } = useThemeSelectorStyles();

    return (
        <Box className={classes.root}>
            <BackgroundEditor />
        </Box>
    )
}
