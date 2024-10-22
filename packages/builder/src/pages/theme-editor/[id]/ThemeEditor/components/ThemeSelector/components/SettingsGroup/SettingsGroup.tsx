import { Box, Typography } from '@mui/material'
import React from 'react';
import { useSettingsGroupStyles } from './SettingsGroup.style';

interface Props {
    label: string;
    children?: React.ReactNode;
}

export default function SettingsGroup({ label, children }: Props) {
    const { classes } = useSettingsGroupStyles();
    return (
        <Box className={classes.root} >
            <Typography variant='h5'>{label}</Typography>
            {children}
        </Box>
    )
}
