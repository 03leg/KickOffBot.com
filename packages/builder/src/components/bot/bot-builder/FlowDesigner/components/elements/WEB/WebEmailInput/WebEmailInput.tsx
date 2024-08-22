import React from 'react'
import { useEntriesHtmlStyles } from '~/components/commons/styles/useEntriesHtml';
import { useWebEmailInputStyles } from './WebEmailInput.style';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { Box } from '@mui/material';
import { WebInputEmailUIElement } from '@kickoffbot.com/types';

interface Props {
    element: WebInputEmailUIElement;
}

export const WebEmailInput = ({ element }: Props) => {
    const { classes: projectEntryClasses } = useEntriesHtmlStyles();
    const { classes } = useWebEmailInputStyles();
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    return (
        <Box className={classes.root}>
            {!element.variableId && <div>User input (e-mail)...</div>}
            {element.variableId && <span className={projectEntryClasses.variable}>{getVariableById(element.variableId)?.name ?? 'Variable not found...'}</span>}
        </Box>
    )
};
