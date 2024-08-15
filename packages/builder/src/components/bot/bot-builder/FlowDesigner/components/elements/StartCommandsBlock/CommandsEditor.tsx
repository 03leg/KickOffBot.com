import React, { useCallback } from 'react';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import { Box, Button } from '@mui/material';
import AppDialog from '~/components/commons/Dialog/AppDialog';
import { CommandDescription, CommandsUIElement } from '@kickoffbot.com/types';
import { CommandsListEditor } from './CommandsListEditor';

interface Props {
    commandsElement: CommandsUIElement;
    onCommandsElementChange: (commandsElement: CommandsUIElement) => void;
}


export const CommandsEditor = ({ commandsElement, onCommandsElementChange }: Props) => {
    const [open, setOpen] = React.useState(false);
    const [commands, setCommands] = React.useState<CommandDescription[]>([]);

    const handleOpenEditor = useCallback(() => {
        setCommands([...commandsElement.commands]);
        setOpen(true);
    }, [commandsElement.commands]);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleSave = useCallback(() => {
        if (commands.map(c => c.command).length !== (new Set(commands.map(c => c.command)).size)) {
            return;
        }

        onCommandsElementChange({ ...commandsElement, commands });
        setOpen(false);
    }, [commands, commandsElement, onCommandsElementChange]);

    return (
        <>
            <Button startIcon={<SettingsSuggestIcon />} onClick={handleOpenEditor}></Button>
            {open && <AppDialog
                onClose={handleClose}
                maxWidth={'sm'}
                buttons={[
                    <Button key={'save'} onClick={handleSave} variant='contained' color='success'>Save</Button>,
                    <Button key={'close'} onClick={handleClose}>Close</Button>
                ]}
                open={true} title={'Edit commands'}>
                <Box sx={{ display: 'flex', padding: (theme) => theme.spacing(1, 0) }}>
                    <CommandsListEditor commands={commands} onCommandsChange={setCommands} />
                </Box>
            </AppDialog>
            }
        </>
    )
}
