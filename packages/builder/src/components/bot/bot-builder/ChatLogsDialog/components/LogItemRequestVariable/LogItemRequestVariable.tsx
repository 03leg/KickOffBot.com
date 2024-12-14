import React, { useCallback } from 'react'
import { useLogItemRequestVariableStyles } from './LogItemRequestVariable.style';
import { useVariableInTextStyles } from '../../../FlowDesigner/components/elements/ChangeVariable/useContentWithVariable';
import dayjs from 'dayjs';
import { Box, Link } from '@mui/material';
import { VariableValueViewer } from '../VariableValueViewer';
import { WebBotLogRequestVariableItem } from '@kickoffbot.com/types';

export const LogItemRequestVariable = ({ log }: { log: WebBotLogRequestVariableItem }) => {
    const { classes: componentClasses } = useLogItemRequestVariableStyles();
    const { classes } = useVariableInTextStyles();
    const [showNewValueDialog, setShowNewValueDialog] = React.useState(false);

    const handleShowNewValue = useCallback(() => {
        setShowNewValueDialog(true);
    }, []);

    return (
        <>
            <Box className={componentClasses.time}>{dayjs(log.time).format('HH:mm:ss.SSS')}</Box>
            Requested variable&nbsp;<span className={classes.variable}>{log.variableName}</span>&nbsp;value, returned value:
            <>&nbsp;<Link className={componentClasses.valueLink} onClick={handleShowNewValue}>show</Link></>
            {showNewValueDialog && <VariableValueViewer title="Returned value" value={log.returnValue} onClose={() => setShowNewValueDialog(false)} />}
        </>
    )
}
