import { WebInputNumberUIElement } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React, { useMemo } from 'react';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { useEntriesHtmlStyles } from '~/components/commons/styles/useEntriesHtml';

interface Props {
    element: WebInputNumberUIElement;
}

export const WebNumberInput = ({ element }: Props) => {
    const { classes } = useEntriesHtmlStyles();
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    const valueRequirements = useMemo(() => {
        const result: React.ReactNode[] = [];
        if (element.max) {
            result.push(<span key={element.max}>Max: {element.max} </span>)
        }
        if (element.max) {
            result.push(<span key={element.min}>Min: {element.min} </span>)
        }
        if (element.step) {
            result.push(<span key={element.step}>Step: {element.step} </span>)
        }

        return result;
    }, [element.max, element.min, element.step])

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {!element.variableId && <div>{element.label}</div>}
            {element.variableId && <span className={classes.variable}>{getVariableById(element.variableId)?.name ?? 'Variable not found...'}</span>}
            {valueRequirements.length > 0 && <span>{valueRequirements}</span>}
        </Box>
    )
}
