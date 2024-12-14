import React, { useMemo } from 'react'
import { useElementPointViewerStyles } from './ElementPointViewer.style';
import { Box, Tooltip } from '@mui/material';
import { WebBotLogElementPoint } from '@kickoffbot.com/types';
import { useFlowDesignerStore } from '../../../store';
import { getColorByString } from './ElementPointViewer.utils';
import { getTitleByType } from '../../../utils';

interface Props {
    elementPoint: WebBotLogElementPoint;
}

export const ElementPointViewer = ({ elementPoint }: Props) => {
    const { classes } = useElementPointViewerStyles();
    const { blocks } = useFlowDesignerStore((state) => ({
        blocks: state.project.blocks
    }));

    const block = useMemo(() => blocks.find((b) => b.id === elementPoint.blockId), [blocks, elementPoint.blockId]);
    const element = useMemo(() => block?.elements.find((e) => e.id === elementPoint.elementId), [block?.elements, elementPoint.elementId]);
    const blockTitle = useMemo(() => block?.title, [block?.title]);


    return (
        <Box className={classes.root}>
            <Box className={classes.blockTitle} sx={{ backgroundColor: getColorByString(block?.id ?? '') }}>{blockTitle}</Box>
            {element?.type && <Tooltip title="Element type"><Box className={classes.elementType} sx={{ backgroundColor: getColorByString(element?.type ?? '') }}>{getTitleByType(element.type)}</Box></Tooltip>}
            {element && <Tooltip title="Element index in block"><Box className={classes.elementIndex} >{(block?.elements.indexOf(element) ?? -1) + 1}</Box></Tooltip>}
        </Box>
    )
}
