import React from 'react'
import { useThemeSelectorStyles } from './ThemeSelector.style';
import { Box } from '@mui/material';

export default function ThemeSelector() {
    const { classes } = useThemeSelectorStyles();

    return (
        <Box className={classes.root}>
            Hello!
        </Box>
    )
}
