import React, { useCallback } from 'react'
import { useLogItemUserInputStyles } from './LogItemUserInput.style';
import { Box, Link, Tooltip } from '@mui/material';
import { WebBotLogUserInputItem } from '@kickoffbot.com/types';
import InputIcon from '@mui/icons-material/Input';
import { getTitleByType } from '../../../utils';
import { getColorByString } from '../ElementPointViewer/ElementPointViewer.utils';
import { VariableValueViewer } from '../VariableValueViewer';

export const LogItemUserInput = ({ log }: { log: WebBotLogUserInputItem }) => {
    const { classes } = useLogItemUserInputStyles();
    const [showNewValueDialog, setShowNewValueDialog] = React.useState(false);


    const handleShowUserValue = useCallback(() => {
        setShowNewValueDialog(true);
    }, []);

    return (
        <>
            <Box className={classes.root}>
                <Tooltip title="User input" ><InputIcon /></Tooltip>
                <Tooltip title="Element type" ><Box className={classes.elementType} sx={{ backgroundColor: getColorByString(log.elementType ?? '') }}>{getTitleByType(log.elementType)}</Box></Tooltip>
                &nbsp;user value:<>&nbsp;<Link className={classes.valueLink} onClick={handleShowUserValue}>show</Link></>
            </Box>
            {showNewValueDialog && <VariableValueViewer title="User value" value={log.value} onClose={() => setShowNewValueDialog(false)} />}
        </>
    )
}
