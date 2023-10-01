import { Box } from '@mui/material'
import React, { useMemo } from 'react'
import { Colors } from '~/themes/Colors'
import { type ToolBoxGroup } from './types'
import { ToolBoxGroupComp } from './ToolBoxGroup';
import { getContentElements, getInputElements } from '../utils';

export const ToolBox = () => {
    const toolBoxGroups: ToolBoxGroup[] = useMemo(() => {
        return [
            {
                title: 'Content',
                items: getContentElements()
            },
            {
                title: 'User Input',
                items: getInputElements()
            },
        ]
    }, []);

    return (
        <Box sx={{
            height: '100%',
            minWidth: 300,
            maxWidth: 300,
            backgroundColor: Colors.WHITE,
            boxShadow: '0px 1px 6px hsla(245, 50%, 17%, 0.1)',
            marginRight: ({ spacing }) => spacing(2),
        }}>
            {toolBoxGroups.map(group => <ToolBoxGroupComp key={group.title} group={group} />)}
        </Box>
    )
}
