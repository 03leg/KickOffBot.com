import { Box, IconButton } from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Colors } from '~/themes/Colors';
import { useFlowDesignerStore } from '../../../store';
import { isNil, remove } from 'lodash';
import { useConfirm } from 'material-ui-confirm';
import { TextContentEditor } from '../elements/TextContent/Editor';
import { ButtonsEditor } from '../elements/ButtonsInput/Editor';
import { TextInputEditor } from '../elements/TextInput/Editor';
import { ContentTextUIElement, ElementType, InputButtonsUIElement, InputTextUIElement, UIElement } from '@kickoffbot.com/types';

interface Props {
    element: UIElement;
}

export const ElementMenu = ({ element }: Props) => {
    const confirm = useConfirm();
    const { updateBlock, blocks, links, removeLinks } = useFlowDesignerStore((state) => ({
        blocks: state.project.blocks,
        updateBlock: state.updateBlock,
        links: state.project.links,
        removeLinks: state.removeLinks
    }));

    const block = useMemo(() => {
        const block = blocks.find(b => b.elements.includes(element));
        if (isNil(block)) {
            throw new Error('InvalidOperationError');
        }
        return block;
    }, [blocks, element]);

    const handleRemoveElement = useCallback(() => {
        void confirm({ description: "This will permanently delete the element.", title: 'Are you sure?' })
            .then(() => {
                const outputLinks = links.filter(l => l.output.elementId === element.id);

                if (outputLinks.length > 0) {
                    removeLinks(outputLinks);
                }

                remove(block.elements, e => e === element);
                updateBlock(block);
            });


    }, [block, confirm, element, links, removeLinks, updateBlock]);

    const getEditor = useCallback((elementArg: UIElement) => {

        switch (element.type) {
            case ElementType.CONTENT_TEXT: {
                const initialElement = elementArg as ContentTextUIElement;
                const newElement: ContentTextUIElement = {
                    ...initialElement
                };

                return { content: (<TextContentEditor element={newElement} />), title: 'Message Editor', newElement };
            }
            case ElementType.INPUT_BUTTONS: {
                const initialElement = elementArg as InputButtonsUIElement;
                const newElement: InputButtonsUIElement = {
                    ...initialElement,
                    buttons: initialElement.buttons.map(b => ({ ...b }))
                };

                return { content: (<ButtonsEditor element={newElement} />), title: 'Buttons Editor', newElement };
            }
            case ElementType.INPUT_TEXT: {
                const initialElement = elementArg as InputTextUIElement;
                const newElement: InputTextUIElement = {
                    ...initialElement
                };

                return { content: (<TextInputEditor element={newElement} />), title: 'Text Input Editor', newElement };

            }
            default: {
                throw new Error('NotImplementedError');
            }
        }

    }, [element.type]);

    const handleEditElement = useCallback(() => {
        const { content, title, newElement } = getEditor(element);

        confirm({ content, title })
            .then(() => {
                // console.log('newElement', newElement);

                const index = block.elements.findIndex(e => e.id === newElement.id);
                block.elements[index] = newElement;
                updateBlock(block);
            })
            .catch(() => {
                /* ... */
            });
    }, [block, confirm, element, getEditor, updateBlock]);

    return (
        <Box sx={{
            display: 'flex',
            backgroundColor: Colors.WHITE,
            borderRadius: 1,
            border: `1px solid ${Colors.BORDER}`, padding: 0.5,
            marginLeft: block.elements.length === 1 ? '23px' : undefined
        }}>
            <IconButton size='small' aria-label="edit" onClick={handleEditElement}>
                <EditIcon />
            </IconButton>
            {block.elements.length > 1 && (
                <IconButton size='small' aria-label="delete" onClick={handleRemoveElement}>
                    <DeleteIcon />
                </IconButton>
            )
            }
        </Box>
    )
}