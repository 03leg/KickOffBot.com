import { WebBotLogChangeVariableItem } from '@kickoffbot.com/types'
import React, { useCallback } from 'react'
import { useLogItemChangeVariableStyles } from './LogItemChangeVariable.style';
import { Box, Link } from '@mui/material';
import dayjs from 'dayjs';
import { useVariableInTextStyles } from '../../../FlowDesigner/components/elements/ChangeVariable/useContentWithVariable';
import { VariableValueViewer } from '../VariableValueViewer';

export const LogItemChangeVariable = ({ log }: { log: WebBotLogChangeVariableItem }) => {
    const { classes: componentClasses } = useLogItemChangeVariableStyles();
    const { classes } = useVariableInTextStyles();
    const [showNewValueDialog, setShowNewValueDialog] = React.useState(false);

    const handleShowNewValue = useCallback(() => {
        setShowNewValueDialog(true);
    }, []);

    // const { classes } = useVa;
    return (
        <>
            <Box className={componentClasses.time}>{dayjs(log.time).format('HH:mm:ss.SSS')}</Box>
            Change variable&nbsp;<span className={classes.variable}>{log.variableName}</span>, new value:
            <>&nbsp;<Link className={componentClasses.valueLink} onClick={handleShowNewValue}>show</Link></>
            , new value type: {log.newValueType}, variable type: {log.variableType}
            {showNewValueDialog && <VariableValueViewer title="New value" value={log.newValue} onClose={() => setShowNewValueDialog(false)} />}
        </>
    )
}
