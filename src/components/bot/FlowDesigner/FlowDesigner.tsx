import { Box } from '@mui/material'
import React from 'react'
import { useStyles } from './FlowDesigner.style'
import { useFlowDesignerNavigation } from './useFlowDesignerNavigation';

export const FlowDesigner = () => {
    const { classes } = useStyles();
    const { bind, transforDescription } = useFlowDesignerNavigation();

    return (
        <Box className={classes.root} {...bind()}>
            <Box className={classes.viewPort} style={{ transform: `translate(${transforDescription.x}px, ${transforDescription.y}px) scale(${transforDescription.scale})` }}>
                <Box sx={{ position: 'absolute', touchAction: 'none', transform: 'translate(0px, 0px)' }}>
                    <Box sx={{ backgroundColor: 'green', height: 100, width: 140 }}></Box>
                </Box>
                <Box sx={{ position: 'absolute', touchAction: 'none', transform: 'translate(200px, 0px)' }}>
                    <Box sx={{ backgroundColor: 'red', height: 100, width: 140 }}></Box>
                </Box>
            </Box>
        </Box>
    )
}
