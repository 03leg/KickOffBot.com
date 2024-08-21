import { WebInputPhoneUIElement } from '@kickoffbot.com/types';
import React, {  } from 'react'
import { useWebPhoneInputStyles } from './WebPhoneInput.style';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { useEntriesHtmlStyles } from '~/components/commons/styles/useEntriesHtml';
import { Box } from '@mui/material';

interface Props {
    element: WebInputPhoneUIElement;
}

export const WebPhoneInput = ({ element }: Props) => {
    const { classes: projectEntryClasses } = useEntriesHtmlStyles();
    const { classes } = useWebPhoneInputStyles();
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    return (
        <Box className={classes.root}>
            {!element.variableId && <div>User input (phone)...</div>}
            {element.variableId && <span className={projectEntryClasses.variable}>{getVariableById(element.variableId)?.name ?? 'Variable not found...'}</span>}
        </Box>
    )
}
