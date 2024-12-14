import { WebBotLogCurrentStateItem } from '@kickoffbot.com/types'
import { Button } from '@mui/material'
import React from 'react'
import { useLogItemCurrentStateStyles } from './LogItemCurrentState.style';
import { CurrentStateViewer } from '../CurrentStateViewer';

export const LogItemCurrentState = ({ log }: { log: WebBotLogCurrentStateItem }) => {
    const { classes } = useLogItemCurrentStateStyles();
    const [showStateDialog, setShowStateDialog] = React.useState(false);

    return (
        <>
            {/* <Box className={classes.time}>{dayjs(log.time).format('HH:mm:ss.SSS')}</Box> */}
            <Button className={classes.button} variant="outlined" size='small' color='info' onClick={() => setShowStateDialog(true)} >show current state</Button>
            {showStateDialog && <CurrentStateViewer state={log.currentState} onClose={() => setShowStateDialog(false)} />}
        </>
    )
}
