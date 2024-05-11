import { Box, Button, IconButton, List, ListItemButton, ListItemText, TextField } from '@mui/material'
import { isNil } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react'
import { ButtonPortDescription, type ButtonElement, type InputButtonsUIElement, BotVariable, MessageButtonsDescription } from '@kickoffbot.com/types';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { v4 } from 'uuid';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { VariableSelectorDialog } from '../../../VariableSelectorDialog';
import { getTextVariableReference } from '~/components/bot/bot-builder/utils';

interface Props {
    element: InputButtonsUIElement | MessageButtonsDescription;
}

export const ManualStrategyButtonsEditor = ({ element }: Props) => {
    const inputRef = React.useRef<HTMLInputElement>();
    const [selectionStart, setSelectionStart] = React.useState<number>();
    const [selectedButton, setSelectedButton] = useState<ButtonElement>();
    const [buttonContent, setButtonContent] = useState<string>();
    const { links } = useFlowDesignerStore((state) => ({
        links: state.project.links,
    }));

    const updateSelectionStart = () => {
        if (!isNil(inputRef.current) && !isNil(inputRef.current.selectionStart)) {
            setSelectionStart(inputRef.current.selectionStart);
        }
    }

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
        element.buttons!.push(newButton);

        setSelectedButton(newButton);
        setButtonContent(newButton.content);

    }, [element.buttons]);

    const handleDeleteButton = useCallback(() => {
        const indexButton = element.buttons!.findIndex(b => b === selectedButton);
        element.buttons!.splice(indexButton, 1);

        setSelectedButton(undefined);
        setButtonContent('');
    }, [element.buttons, selectedButton]);

    const canDeleteButton = useMemo(() => {
        if (element.buttons!.length === 1) {
            return false;
        }

        if (links.some(p => !isNil((p.output as ButtonPortDescription).buttonId) && (p.output as ButtonPortDescription).buttonId === selectedButton?.id)) {
            return false;
        }

        return true;
    }, [element.buttons, links, selectedButton?.id]);


    const handleInsertVariable = useCallback((variable: BotVariable) => {
        if (isNil(selectedButton)) {
            throw new Error('InvalidOperationError');
        }
        const position = selectionStart ?? buttonContent?.length ?? 0;
        const content = buttonContent ?? '';
        const output = [content.slice(0, position), getTextVariableReference(variable), content.slice(position)].join('');

        setButtonContent(output);
        selectedButton.content = output;
    }, [buttonContent, selectedButton, selectionStart]);


    return (
        <Box sx={{ flex: 1, display: 'flex', backgroundColor: '#F3F6F9', height: '300px', padding: 1 }}>
            <Box sx={{ width: '200px', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
                <List dense={true} sx={{ flex: 1, height: 'calc(100% - 55px)', overflowY: 'auto' }}>
                    {element.buttons!.map(b => (
                        <ListItemButton onClick={() => handleSelectButton(b)} selected={selectedButton === b} key={b.id}><ListItemText
                            primary={b.content}
                            primaryTypographyProps={{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }} /></ListItemButton>
                    ))}
                </List>
                <Box sx={{ padding: 1 }}>
                    <Button color='success' fullWidth variant="contained" startIcon={<AddIcon />} onClick={handleAddButton}>Add button</Button>
                </Box>
            </Box>
            {!isNil(selectedButton) &&
                (
                    <Box sx={{ flex: 1, backgroundColor: 'white', marginLeft: 1, padding: 1, flexDirection: 'column', display: 'flex', alignItems: 'flex-end' }}>
                        <TextField inputRef={inputRef} fullWidth onSelect={updateSelectionStart} variant="outlined" value={buttonContent} onChange={handleButtonTitleChange} />

                        <Box sx={{ marginTop: 1, display: 'flex' }}>
                            <IconButton
                                disabled={!canDeleteButton}
                                aria-label="delete"
                                color="primary"
                                title='Delete button'
                                onClick={handleDeleteButton} >
                                <DeleteIcon />
                            </IconButton>
                            <VariableSelectorDialog onInsertVariable={handleInsertVariable} supportPathForObject={false} />
                        </Box>

                    </Box>
                )
            }
        </Box>
    )

}
