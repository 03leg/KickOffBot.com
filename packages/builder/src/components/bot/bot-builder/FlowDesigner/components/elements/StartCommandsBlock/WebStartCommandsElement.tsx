import { FlowDesignerUIBlockDescription, PortType, WebStartCommandsUIElement } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React from 'react';
import { OutputPort } from '../../OutputPort';
import { makeStyles } from 'tss-react/mui';

interface Props {
  blockDescription: FlowDesignerUIBlockDescription;
}

export const useStyles = makeStyles()(() => ({
  port: {
    position: 'absolute',
    top: 12,
    right: -17
  },
  button: {
    position: 'relative',
    width: '100%',

  },
  command: {
    backgroundColor: '#4CAF50',
    borderRadius: '5px',
    color: 'white',
    padding: '2px',
    display: 'flex',
    justifyContent: 'center',
    fontSize: '24px',
    flexDirection: 'column',
    alignItems: 'center'
  },
  startCommand: {
    backgroundColor: '#2196F3'
  },
}));

export const WebStartCommandsElement = ({ blockDescription }: Props) => {
  const { classes, cx } = useStyles();
  const [commandsElementValue, setCommandsElementValue] = React.useState<WebStartCommandsUIElement>(blockDescription.elements[0] as WebStartCommandsUIElement);

  return (
    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
      {commandsElementValue.commands?.map(commandItem => {
        return (
          <Box key={commandItem.id} className={classes.button}>
            <OutputPort className={classes.port} elementId={commandsElementValue.id} buttonId={commandItem.id} outPortType={PortType.BUTTONS_ELEMENT} />
            <Box sx={{ marginBottom: 1 }} className={cx(classes.command, commandItem.id === 'start' ? classes.startCommand : '')}>
              {commandItem.title}
              {commandItem.description &&<Box sx={{ fontSize: '1rem' }}>{commandItem.description}</Box>}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
