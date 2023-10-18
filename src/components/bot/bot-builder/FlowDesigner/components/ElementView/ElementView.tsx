import { Box } from '@mui/material'
import React, { useMemo } from 'react'
import { TextContent } from '../elements/TextContent';
import { Colors } from '~/themes/Colors';
import { ElementType, type UIElement } from '../../../types';
import { getIconByType } from '../../../utils';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useStyles } from './ElementView.style';
import { TextInput } from '../elements/TextInput';
import { ButtonsInput } from '../elements/ButtonsInput/ButtonsInput';

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
    } = useSortable({ id: element.id, animateLayoutChanges: () => false, data: { elementWidth: 333 }});

    // if (transform) {
    //     transform.scaleX = 1;
    //     transform.scaleY = 1;
    // }

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        scale
    };

    return (
        <Box ref={setNodeRef} className={isDragging ? classes.dragging : ''} style={style} {...attributes} {...listeners} sx={{ display: 'flex', backgroundColor: Colors.BACKGROUND_COLOR, border: Colors.BORDER, borderRadius: 1, mb: 1, alignItems: 'flex-start', padding: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>{icon}</Box>
            <Box sx={{ flex: 1 }}>{child}</Box>
        </Box>
    )
}
