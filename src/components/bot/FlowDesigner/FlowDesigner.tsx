import { Box } from '@mui/material'
import React from 'react'
import { useStyles } from './FlowDesigner.style'

export const FlowDesigner = () => {
    const { classes } = useStyles();

    return (
        <Box className={classes.root}>
            <Box className={classes.viewPort}>
                <Box sx={{ position: 'absolute', touchAction: 'none', transform: 'translate(-189px, -870px)' }}>
                    <Box sx={{ backgroundColor: 'green', height: 100, width: 140 }}></Box>
                </Box>
                <Box sx={{ position: 'absolute', touchAction: 'none', transform: 'translate(33px, -516px)' }}>
                    <Box sx={{ backgroundColor: 'red', height: 100, width: 140 }}></Box>
                </Box>
            </Box>
        </Box>
    )
}
