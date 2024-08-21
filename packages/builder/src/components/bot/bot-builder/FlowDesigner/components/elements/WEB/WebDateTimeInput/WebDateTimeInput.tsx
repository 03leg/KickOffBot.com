import { WebInputDateTimeUIElement } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React from 'react';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { useEntriesHtmlStyles } from '~/components/commons/styles/useEntriesHtml';
import { useWebDateTimeInputStyles } from './WebDateTimeInput.style';

interface Props {
    element: WebInputDateTimeUIElement;
}

export const WebDateTimeInput = ({ element }: Props) => {
    const { classes: projectEntryClasses } = useEntriesHtmlStyles();
    const { classes } = useWebDateTimeInputStyles();
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    return (
        <Box className={classes.root}>
            {!element.variableId && <div>User input (date+time)...</div>}
            {element.variableId && <span className={projectEntryClasses.variable}>{getVariableById(element.variableId)?.name ?? 'Variable not found...'}</span>}
        </Box>
    )
}
