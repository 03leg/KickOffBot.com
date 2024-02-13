import { Box } from '@mui/material'
import React, { useMemo } from 'react'
import { Colors } from '~/themes/Colors'
import { type ToolBoxGroup } from './types'
import { ToolBoxGroupComp } from './ToolBoxGroup';
import { getContentElements, getInputElements, getLogicElements } from '../utils';
import { useDndContext } from '@dnd-kit/core';
import { isNil } from 'lodash';
import { APP_ELEMENT_ROLE } from '../constants';

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
            {
                title: 'Logic',
                items: getLogicElements()
            },
        ]
    }, []);

    const { active } = useDndContext();

    return (
        <Box
            data-app-role={APP_ELEMENT_ROLE.toolBox}
            sx={{
                height: 'calc(100% - 40px)',
                minWidth: 300,
                maxWidth: 300,
                backgroundColor: Colors.WHITE,
                boxShadow: '0px 1px 6px hsla(245, 50%, 17%, 0.1)',
                marginLeft: ({ spacing }) => spacing(2),
                position: 'absolute',
                zIndex: isNil(active) ? 1 : 0,
                marginTop: '20px',
                marginBottom: '20px',
                opacity: isNil(active) ? 1 : 0.6,
            }}>
            {toolBoxGroups.map(group => <ToolBoxGroupComp key={group.title} group={group} />)}
        </Box>
    )
}
