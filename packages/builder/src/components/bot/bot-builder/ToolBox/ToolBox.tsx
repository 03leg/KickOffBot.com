import { Box } from '@mui/material'
import React, { useMemo } from 'react'
import { Colors } from '~/themes/Colors'
import { ToolBoxGroupComp } from './ToolBoxGroup';
import { useDndContext } from '@dnd-kit/core';
import { isNil } from 'lodash';
import { APP_ELEMENT_ROLE } from '../constants';
import { useFlowDesignerStore } from '../store';
import { BotPlatform } from '@kickoffbot.com/types';
import { TELEGRAM_TOOLBOX_GROUPS, WEB_TOOLBOX_GROUPS } from './toolBox.constants';

export const ToolBox = () => {
    const { active } = useDndContext();
    const { platform } = useFlowDesignerStore((state) => ({
        platform: state.platform
    }));

    const toolboxGroups = useMemo(() => {
        if (platform === BotPlatform.Telegram) {
            return TELEGRAM_TOOLBOX_GROUPS;
        }
        if (platform === BotPlatform.WEB) {
            return WEB_TOOLBOX_GROUPS;
        }

        throw new Error('InvalidOperationError');
    }, [platform])

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
            {toolboxGroups.map(group => <ToolBoxGroupComp key={group.title} group={group} />)}
        </Box>
    )
}
