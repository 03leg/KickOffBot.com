import React from 'react'
import { type InputTextUIElement, type UIElement } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';

interface Props {
    element: UIElement;
}

export const useStyles = makeStyles()(() => ({
    variable: {
        backgroundColor: '#9c27b0',
        borderRadius: '5px',
        color: 'white',
        paddingLeft: '5px',
        paddingRight: '5px',
        paddingBottom: '1px',
        paddingTop: '1px',
        marginLeft: 5
    }
}));

export const TextInput = ({ element }: Props) => {
    const contentTextElement = element as InputTextUIElement;
    const { classes } = useStyles();
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    return (
        <Box sx={{ display: 'flex' }}>
            {!contentTextElement.variableId && <div>{contentTextElement.label}</div>}
            {contentTextElement.variableId && <span className={classes.variable}>{getVariableById(contentTextElement.variableId)?.name ?? 'Not found...'}</span>}
        </Box>
    )
}
