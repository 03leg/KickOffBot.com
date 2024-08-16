import { WebInputTextUIElement } from '@kickoffbot.com/types';
import React from 'react';
import { Box } from '@mui/material';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { useEntriesHtmlStyles } from '~/components/commons/styles/useEntriesHtml';

interface Props {
  element: WebInputTextUIElement;
}

export const WebTextInput = ({ element }: Props) => {
  const { classes } = useEntriesHtmlStyles();
  const { getVariableById } = useFlowDesignerStore((state) => ({
    getVariableById: state.getVariableById
  }));

  return (
    <Box sx={{ display: 'flex' }}>
      {!element.variableId && <div>{element.label}</div>}
      {element.variableId && <span className={classes.variable}>{getVariableById(element.variableId)?.name ?? 'Variable not found...'}</span>}
    </Box>
  )
}
