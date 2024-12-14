import { Box } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'
import { BotMessageViewer } from '../BotMessageViewer'
import { ElementPointViewer } from '../ElementPointViewer'
import { WebBotLogItem } from '@kickoffbot.com/types'
import { useLogItemMessageStyles } from './LogItemMessage.style'

export const LogItemMessage = ({ log }: { log: WebBotLogItem }) => {
    const { classes } = useLogItemMessageStyles();
    return (
        <>
            <Box className={classes.time}>{dayjs(log.time).format('HH:mm:ss.SSS')}</Box>
            <Box className={classes.message}>{log.message}</Box>
            {log.elementPoint && <ElementPointViewer elementPoint={log.elementPoint} />}
            {log.botMessage && <BotMessageViewer message={log.botMessage} />}
        </>
    )
}
