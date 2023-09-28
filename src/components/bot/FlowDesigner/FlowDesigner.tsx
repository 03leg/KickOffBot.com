import { Box } from '@mui/material'
import React from 'react'
import { useStyles } from './FlowDesigner.style'
import { useFlowDesignerNavigation } from './useFlowDesignerNavigation';
import { FlowDesignerBlock } from './components/FlowDesignerBlock';

export const FlowDesigner = () => {
    const { classes } = useStyles();
    const { bind, transforDescription } = useFlowDesignerNavigation();

    return (
        <Box className={classes.root} {...bind()}>
            <Box className={classes.viewPort} style={{ transform: `translate(${transforDescription.x}px, ${transforDescription.y}px) scale(${transforDescription.scale})` }}>
                <FlowDesignerBlock color='orange' transformDescriptionInitial={{ x: 0, y: 0 }} rootScale={transforDescription.scale} />
                <FlowDesignerBlock color='yellow' transformDescriptionInitial={{ x: 0, y: 200 }} rootScale={transforDescription.scale} />
                <FlowDesignerBlock color='green' transformDescriptionInitial={{ x: 200, y: 300 }} rootScale={transforDescription.scale} />
            </Box>
        </Box>
    )
}
