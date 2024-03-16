import { Box, Button, IconButton, List, ListItemButton, ListItemText, TextField } from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { ButtonPortDescription, CommandDescription } from '@kickoffbot.com/types';
import { isNil } from 'lodash';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 } from 'uuid';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';

interface Props {
    commands: CommandDescription[];
    onCommandsChange: (commands: CommandDescription[]) => void
}

function getUniqueCommandName(commands: CommandDescription[], prefix = '/new-command-') {
    let index = 1;

    do {
        const commandName = `${prefix}${index}`;
        if (!commands.find(c => c.command === commandName)) {
            return commandName
        }
        index++;
    } while (true);
}

export const CommandsListEditor = ({ commands, onCommandsChange }: Props) => {
    const [selectedCommand, setSelectedCommand] = useState<CommandDescription>();
    const [commandContent, setCommandContent] = useState<string>();
    const { links } = useFlowDesignerStore((state) => ({
        links: state.project.links,
    }));

    const handleAddCommand = useCallback(() => {
        const newCommand: CommandDescription = { id: v4(), command: getUniqueCommandName(commands), description: '' };

        setSelectedCommand(newCommand);
        setCommandContent(newCommand.command);

        onCommandsChange([...commands, newCommand]);
    }, [commands, onCommandsChange]);

    const handleSelectCommand = useCallback((c: CommandDescription) => {
        setSelectedCommand(c);
        setCommandContent(c.command);
    }, []);

    const handleCommandTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (isNil(selectedCommand)) {
            throw new Error('InvalidOperationError');
        }

        let newValue = event.target.value;

        if (newValue === '/start') {
            newValue = getUniqueCommandName(commands, '/start-');
        }

        setCommandContent(newValue);
        selectedCommand.command = newValue;
    }, [commands, selectedCommand]);

    const canDeleteButton = useMemo(() => {
        if (selectedCommand?.command === '/start') {
            return false;
        }

        if (links.some(link => !isNil((link.output as ButtonPortDescription).buttonId) && (link.output as ButtonPortDescription).buttonId === selectedCommand?.id)) {
            return false;
        }

        return true;
    }, [links, selectedCommand?.command, selectedCommand?.id]);

    const handleDeleteButton = useCallback(() => {
        const indexCommand = commands.findIndex(b => b === selectedCommand);
        commands.splice(indexCommand, 1);

        onCommandsChange([...commands]);

        setSelectedCommand(undefined);
        setCommandContent('');
    }, [commands, onCommandsChange, selectedCommand]);

    return (
        <Box sx={{ flex: 1, display: 'flex', backgroundColor: '#F3F6F9', height: '300px', padding: 1 }}>
            <Box sx={{ width: '200px', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
                <List dense={true} sx={{ flex: 1, height: 'calc(100% - 55px)', overflowY: 'auto' }}>
                    {commands.map(b => (
                        <ListItemButton onClick={() => handleSelectCommand(b)} selected={selectedCommand === b} key={b.id}><ListItemText
                            primary={b.command}
                            primaryTypographyProps={{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }} /></ListItemButton>
                    ))}
                </List>
                <Box sx={{ padding: 1 }}>
                    <Button color='success' fullWidth variant="contained" startIcon={<AddIcon />} onClick={handleAddCommand}>Add command</Button>
                </Box>
            </Box>
            {!isNil(selectedCommand) &&
                (
                    <Box sx={{ flex: 1, backgroundColor: 'white', marginLeft: 1, padding: 1, flexDirection: 'column', display: 'flex', alignItems: 'flex-end' }}>
                        <TextField fullWidth variant="outlined" value={commandContent} onChange={handleCommandTextChange} disabled={selectedCommand.command === '/start'} />

                        <Box sx={{ marginTop: 1, display: 'flex' }}>
                            <IconButton
                                disabled={!canDeleteButton}
                                aria-label="delete"
                                color="primary"
                                title='Delete button'
                                onClick={handleDeleteButton} >
                                <DeleteIcon />
                            </IconButton>
                        </Box>

                    </Box>
                )
            }
        </Box>
    )
}
