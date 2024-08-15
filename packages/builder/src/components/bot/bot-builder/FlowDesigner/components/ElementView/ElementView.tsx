import { Box } from '@mui/material'
import React, { useCallback, useContext, useMemo } from 'react'
import { TextContent } from '../elements/TextContent';
import { Colors } from '~/themes/Colors';
import { ContentTextUIElement, ElementType, GoogleSheetsIntegrationUIElement, HTTPRequestIntegrationUIElement, SendTelegramMessageIntegrationUIElement, WebContentTextUIElement, type UIElement } from '@kickoffbot.com/types';
import { getIconByType } from '../../../utils';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useStyles } from './ElementView.style';
import { TextInput } from '../elements/TextInput';
import { ButtonsInput } from '../elements/ButtonsInput/ButtonsInput';
import { FlowDesignerContext } from '../../context';
import { ElementMenu } from '../ElementMenu';
import { ChangeVariable } from '../elements/ChangeVariable';
import { Condition } from '../elements/Condition';
import { EditMessage } from '../elements/EditMessage';
import { RemoveMessage } from '../elements/RemoveMessage';
import { IntegrationSendTelegramMessage } from '../elements/IntegrationSendTelegramMessage';
import { IntegrationGoogleSheets } from '../elements/IntegrationGoogleSheets';
import { IntegrationHttpRequest } from '../elements/IntegrationHttpRequest';
import { WebMessage } from '../elements/WEB/WebMessage';

interface Props {
    element: UIElement;
    scale?: number;
}

export const ElementView = ({ element, scale }: Props) => {
    const child = useMemo(() => {
        let result: React.JSX.Element | null = null;

        switch (element.type) {
            case ElementType.CONTENT_TEXT: {
                result = (<TextContent element={element as ContentTextUIElement} elementId={element.id} />);
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
            case ElementType.LOGIC_CHANGE_VARIABLE: {
                result = (<ChangeVariable element={element} />)
                break;
            }
            case ElementType.LOGIC_CONDITION: {
                result = <Condition element={element} />
                break;
            }
            case ElementType.LOGIC_EDIT_MESSAGE: {
                result = <EditMessage element={element} />
                break;
            }
            case ElementType.LOGIC_REMOVE_MESSAGE: {
                result = <RemoveMessage element={element} />
                break;
            }
            case ElementType.INTEGRATION_SEND_TELEGRAM_MESSAGE: {
                result = <IntegrationSendTelegramMessage element={element as SendTelegramMessageIntegrationUIElement} />
                break;
            }
            case ElementType.INTEGRATION_GOOGLE_SHEETS: {
                result = <IntegrationGoogleSheets element={element as GoogleSheetsIntegrationUIElement} />
                return result;
            }
            case ElementType.INTEGRATION_HTTP_REQUEST: {
                result = <IntegrationHttpRequest element={element as HTTPRequestIntegrationUIElement} />
                return result;
            }
            case ElementType.WEB_CONTENT_MESSAGE: {
                result = <WebMessage element={element as WebContentTextUIElement} />
                return result;
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
                <Box sx={{ width: 'calc(100% - 35px)' }}>{child}</Box>
            </Box>
        </Box>
    )
}
