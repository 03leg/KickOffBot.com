import { Box, Button, IconButton, List, ListItemButton, ListItemText, TextField } from '@mui/material'
import { isNil } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react'
import { ButtonPortDescription, type ButtonElement, BotVariable } from '@kickoffbot.com/types';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { v4 } from 'uuid';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { VariableSelectorDialog } from '../../../VariableSelectorDialog';
import { getTextVariableReference } from '~/components/bot/bot-builder/utils';
import { EmojiButton } from '../../EmojiButton/EmojiButton';

interface Props {
    buttons?: ButtonElement[];
    onButtonsChange: (buttons: ButtonElement[]) => void;
}

export const ManualStrategyButtonsEditor = ({ buttons = [], onButtonsChange }: Props) => {
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

        onButtonsChange([...buttons, newButton]);

        setSelectedButton(newButton);
        setButtonContent(newButton.content);

    }, [buttons, onButtonsChange]);

    const handleDeleteButton = useCallback(() => {
        const indexButton = buttons.findIndex(b => b === selectedButton);
        buttons.splice(indexButton, 1);

        setSelectedButton(undefined);
        setButtonContent('');

        onButtonsChange([...buttons]);

    }, [buttons, onButtonsChange, selectedButton]);

    const canDeleteButton = useMemo(() => {
        if (buttons.length === 1) {
            return false;
        }

        if (links.some(p => !isNil((p.output as ButtonPortDescription).buttonId) && (p.output as ButtonPortDescription).buttonId === selectedButton?.id)) {
            return false;
        }

        return true;
    }, [buttons.length, links, selectedButton?.id]);

    const insertInButtonText = useCallback((text: string) => {
        if (isNil(selectedButton)) {
            throw new Error('InvalidOperationError');
        }
        const position = selectionStart ?? buttonContent?.length ?? 0;
        const content = buttonContent ?? '';
        const output = [content.slice(0, position), text, content.slice(position)].join('');

        setButtonContent(output);
        selectedButton.content = output;
    }, [buttonContent, selectedButton, selectionStart]);


    const handleInsertVariable = useCallback((variable: BotVariable, path?: string) => {
        insertInButtonText(getTextVariableReference(variable, path));
    }, [insertInButtonText]);

    const handleInsertEmoji = useCallback((emoji: string) => {
        insertInButtonText(emoji);
    }, [insertInButtonText]);


    return (
        <Box sx={{ flex: 1, display: 'flex', backgroundColor: '#F3F6F9', height: '300px', padding: 1 }}>
            <Box sx={{ width: '200px', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
                <List dense={true} sx={{ flex: 1, height: 'calc(100% - 55px)', overflowY: 'auto' }}>
                    {buttons.map(b => (
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
                            <EmojiButton onInsertEmoji={handleInsertEmoji} />

                            <VariableSelectorDialog onInsertVariable={handleInsertVariable} supportPathForObject={true} />
                        </Box>

                    </Box>
                )
            }
        </Box>
    )

}
