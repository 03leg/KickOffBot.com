import { WebBotLogChangeVariableItem, WebBotLogCurrentStateItem, WebBotLogItem, WebBotLogItemBase, WebBotLogRequestVariableItem, WebBotLogsType, WebBotLogType, WebBotLogUserInputItem } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React, { useCallback } from 'react';
import { useLogViewerStyles } from './LogViewer.style';
import { LogItemMessage } from '../LogItemMessage';
import { LogItemChangeVariable } from '../LogItemChangeVariable';
import { LogItemRequestVariable } from '../LogItemRequestVariable';
import { LogItemCurrentState } from '../LogItemCurrentState';
import { LogItemUserInput } from '../LogItemUserInput';

interface Props {
    logs: WebBotLogItemBase[];
}

export const LogViewer = ({ logs }: Props) => {
    const { classes } = useLogViewerStyles();

    const getColor = useCallback((log: WebBotLogItemBase) => {

        if (log.logItemType === WebBotLogType.MESSAGE) {
            const logMsg = log as WebBotLogItem;

            switch (logMsg.type) {
                case WebBotLogsType.ERROR: {
                    return '#e5393569';
                }
                case WebBotLogsType.WARNING: {
                    return '#fb8c0075';
                }
            }
        }

        return undefined;
    }, []);

    return (
        <Box className={classes.root}>
            {logs.map((log) => (
                <Box className={classes.logItem} sx={{ backgroundColor: getColor(log) }} key={log.time}>
                    {log.logItemType === WebBotLogType.MESSAGE && <LogItemMessage log={log as WebBotLogItem} />}
                    {log.logItemType === WebBotLogType.CHANGE_VARIABLE && <LogItemChangeVariable log={log as WebBotLogChangeVariableItem} />}
                    {log.logItemType === WebBotLogType.REQUEST_VARIABLE && <LogItemRequestVariable log={log as WebBotLogRequestVariableItem} />}
                    {log.logItemType === WebBotLogType.CURRENT_STATE && <LogItemCurrentState log={log as WebBotLogCurrentStateItem} />}
                    {log.logItemType === WebBotLogType.USER_INPUT && <LogItemUserInput log={log as WebBotLogUserInputItem} />}
                </Box>
            ))}
        </Box>
    )
}
