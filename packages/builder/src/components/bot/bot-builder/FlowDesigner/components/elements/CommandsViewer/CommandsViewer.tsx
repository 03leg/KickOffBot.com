import { CommandsUIElement, FlowDesignerUIBlockDescription, PortType } from '@kickoffbot.com/types';
import { Box, Button } from '@mui/material';
import React, { useCallback } from 'react';
import { makeStyles } from 'tss-react/mui';
import { OutputPort } from '../../OutputPort';
import { CommandsEditor } from './CommandsEditor';


interface Props {
    // commandsElement: CommandsUIElement;
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
        fontSize: '24px'
    },
    startCommand: {
        backgroundColor: '#2196F3'
    },
}));


export const CommandsViewer = ({ blockDescription }: Props) => {
    const { classes, cx } = useStyles();
    const [commandsElementValue, setCommandsElementValue] = React.useState<CommandsUIElement>(blockDescription.elements[0] as CommandsUIElement);


    const handleCommandsElementChange = useCallback((commandsElement: CommandsUIElement) => {
        setCommandsElementValue(commandsElement);
        blockDescription.elements = [commandsElement];
    }, [blockDescription])
 
    return (
        <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
            {commandsElementValue.commands?.map(b => {
                return (
                    <Box key={b.command} className={classes.button}>
                        <OutputPort className={classes.port} elementId={commandsElementValue.id} buttonId={b.id} outPortType={PortType.BUTTONS_ELEMENT} />
                        <Box sx={{ marginBottom: 1 }} className={cx(classes.command, b.command === '/start' ? classes.startCommand : '' )}>
                            {b.command}
                        </Box>
                    </Box>
                )
            })}
           <CommandsEditor commandsElement={commandsElementValue} onCommandsElementChange={handleCommandsElementChange}/>
        </Box>
    )
}
