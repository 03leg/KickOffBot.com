import { Box } from '@mui/material'
import React from 'react'
import { useThemeFieldEditorStyles } from './ThemeFieldEditor.style';

interface Props {
    label: string;
    children?: React.ReactNode;
}

export default function ThemeFieldEditor({ label, children }: Props) {
    const { classes } = useThemeFieldEditorStyles()

    return <Box className={classes.root}>
        <Box className={classes.fieldTitle}>{label}</Box>
        <Box className={classes.fieldContent}>{children}</Box>
    </Box>
}