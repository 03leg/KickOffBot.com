import { Box } from '@mui/material'
import React, { useCallback, useContext, useMemo } from 'react'
import { TextContent } from '../elements/TextContent';
import { Colors } from '~/themes/Colors';
import { ElementType, type UIElement } from '@kickoffbot.com/types';
import { getIconByType } from '../../../utils';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useStyles } from './ElementView.style';
import { TextInput } from '../elements/TextInput';
import { ButtonsInput } from '../elements/ButtonsInput/ButtonsInput';
import { FlowDesignerContext } from '../../context';
import { ElementMenu } from '../ElementMenu';

interface Props {
    element: UIElement;
    scale?: number;
}

export const ElementView = ({ element, scale }: Props) => {
    const child = useMemo(() => {
        let result: React.JSX.Element | null = null;

        switch (element.type) {
            case ElementType.CONTENT_TEXT: {
                result = (<TextContent element={element} />);
                break;
            }
            case ElementType.INPUT_TEXT: {
                result = (<TextInput element={element} />)
                break;
            }
            case ElementType.INPUT_BUTTONS: {
                result = (<ButtonsInput element={element} />)
                break;
            }
            default: {
                throw new Error('NotImplementedError');
            }
        }

        return result;

    }, [element]);

    const icon = useMemo(() => {
        return getIconByType(element.type);
    }, [element.type]);

    const { classes } = useStyles();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        node,
        rect,
    } = useSortable({ id: element.id, animateLayoutChanges: () => false, data: { elementWidth: 333 } });
    const context = useContext(FlowDesignerContext)
    const handleElementClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
        context.setSelectedElement(element);
        context.setSelectedBlock(null);
        e.stopPropagation();
    }, [context, element]);

    const selected = context.selectedElement === element;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        scale
    };

    return (
        <Box sx={{ mb: 1, position: 'relative' }} ref={setNodeRef} onClick={handleElementClick} className={isDragging ? classes.dragging : ''} style={style} {...attributes} {...listeners}>
            {selected && <Box sx={{ position: 'absolute', top: 0, left: -82 }}>
                <ElementMenu element={element} />
            </Box>}
            <Box
                sx={{
                    display: 'flex', backgroundColor: Colors.BACKGROUND_COLOR, borderRadius: 1, alignItems: 'flex-start', padding: 1,
                    border: selected ? `1px solid ${Colors.SELECTED}` : `1px solid ${Colors.BORDER}`,
                }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>{icon}</Box>
                <Box sx={{ width: 'calc(100% - 35px)'}}>{child}</Box>
            </Box>
        </Box>
    )
}
