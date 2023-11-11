import { Box, Button, IconButton, List, ListItemButton, ListItemText, TextField } from '@mui/material'
import { isNil } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react'
import { ButtonPortDescription, type ButtonElement, type InputButtonsUIElement } from '~/components/bot/bot-builder/types';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { v4 } from 'uuid';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';


interface Props {
    element: InputButtonsUIElement;
}

export const ButtonsEditor = ({ element }: Props) => {

    const [selectedButton, setSelectedButton] = useState<ButtonElement>();
    const [buttonContent, setButtonContent] = useState<string>();
    const { links } = useFlowDesignerStore((state) => ({
        links: state.project.links,
    }));

    const handleButtonTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {

        if (isNil(selectedButton)) {
            throw new Error('InvalidOperationError');
        }

        selectedButton.content = event.target.value;
        setButtonContent(selectedButton.content);
    }, [selectedButton]);

    const handleSelectButton = useCallback((b: ButtonElement) => {
        setSelectedButton(b);
        setButtonContent(b.content);
    }, []);

    const handleAddButton = useCallback(() => {
        const newButton = { content: '#New button#', id: v4() };
        element.buttons.push(newButton);

        setSelectedButton(newButton);
        setButtonContent(newButton.content);

    }, [element.buttons]);

    const handleDeleteButton = useCallback(() => {
        const indexButton = element.buttons.findIndex(b => b === selectedButton);
        element.buttons.splice(indexButton, 1);

        setSelectedButton(undefined);
        setButtonContent('');
    }, [element.buttons, selectedButton]);

    const canDeleteButton = useMemo(() => {
        if (element.buttons.length === 1) {
            return false;
        }

        if (links.some(p => !isNil((p.output as ButtonPortDescription).buttonId) && (p.output as ButtonPortDescription).buttonId === selectedButton?.id)) {
            return false;
        }

        return true;
    }, [element.buttons.length, links, selectedButton?.id]);


    return (
        <Box sx={{ flex: 1, display: 'flex', backgroundColor: '#F3F6F9', height: '300px', padding: 1 }}>
            <Box sx={{ width: '200px', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
                <List dense={true} sx={{ flex: 1, height: 'calc(100% - 55px)', overflowY: 'auto' }}>
                    {element.buttons.map(b => (
                        <ListItemButton onClick={() => handleSelectButton(b)} selected={selectedButton === b} key={b.id}><ListItemText primary={b.content} /></ListItemButton>
                    ))}
                </List>
                <Box sx={{ padding: 1 }}>
                    <Button color='success' fullWidth variant="contained" startIcon={<AddIcon />} onClick={handleAddButton}>Add button</Button>
                </Box>
            </Box>
            {!isNil(selectedButton) &&
                (
                    <Box sx={{ flex: 1, backgroundColor: 'white', marginLeft: 1, padding: 1, flexDirection: 'column', display: 'flex', alignItems: 'flex-end' }}>
                        <TextField fullWidth variant="outlined" value={buttonContent} onChange={handleButtonTitleChange} />
                        <IconButton sx={{ marginTop: 1 }}
                            disabled={!canDeleteButton}
                            aria-label="delete"
                            color="primary"
                            title='Delete button'
                            onClick={handleDeleteButton} >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                )
            }
        </Box>
    )
}
