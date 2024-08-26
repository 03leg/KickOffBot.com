import { ContentTextUIElement, ElementType, FlowDesignerUIBlockDescription, UIElement } from '@kickoffbot.com/types';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { isNil } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { getPreviewTelegramMessage } from './MessageElementSelector.utils';

interface Props {
    messageElementId?: string;
    onChange: (messageElementId?: string) => void;
}

const getBlockIdFromMessageElementId = (messageElementId: string | undefined, blocks: FlowDesignerUIBlockDescription[]) => {
    if (isNil(messageElementId)) {
        return undefined;
    }


    return blocks.find(b => b.elements.some(e => e.id === messageElementId))?.id ?? undefined;
}

const availableToDeleteElementTypes = [ElementType.CONTENT_TEXT,
ElementType.WEB_CONTENT_MESSAGE,
ElementType.WEB_INPUT_TEXT,
ElementType.WEB_INPUT_BUTTONS,
ElementType.WEB_INPUT_DATE_TIME,
ElementType.WEB_INPUT_EMAIL,
ElementType.WEB_INPUT_NUMBER,
ElementType.WEB_INPUT_PHONE,
ElementType.WEB_INPUT_TEXT,
];

export const MessageElementSelector = ({ messageElementId, onChange }: Props) => {
    const { blocks } = useFlowDesignerStore((state) => ({
        blocks: state.project.blocks
    }));
    const [blockId, setBlockId] = useState<string | undefined>(getBlockIdFromMessageElementId(messageElementId, blocks));


    const handleBlockChange = useCallback((event: SelectChangeEvent<string>) => {
        const localBlockId = event.target.value;
        setBlockId(localBlockId);
        onChange(undefined);
    }, [onChange]);

    const handleMessageElementChange = useCallback((event: SelectChangeEvent<string>) => {
        const messageElementId = event.target.value;
        onChange(messageElementId);
    }, [onChange]);

    const messageElements = useMemo(() => {
        if (!blockId) {
            return [];
        }

        return blocks.find(b => b.id === blockId)?.elements.filter(e => availableToDeleteElementTypes.includes(e.type)) ?? [];
    }, [blockId, blocks]);


    const getMessagePreview = (element: UIElement) => {
        switch (element.type) {
            case ElementType.CONTENT_TEXT: {
                return getPreviewTelegramMessage((element as ContentTextUIElement).telegramContent ?? 'Message without text...');
            }
            case ElementType.WEB_CONTENT_MESSAGE: {
                return getPreviewTelegramMessage((element as ContentTextUIElement).htmlContent ?? 'Message without text...');
            }
            case ElementType.WEB_INPUT_TEXT: {
                return "User input: text";
            }
            case ElementType.WEB_INPUT_BUTTONS: {
                return "User input: buttons";
            }
            case ElementType.WEB_INPUT_DATE_TIME: {
                return "User input: date and time";
            }
            case ElementType.WEB_INPUT_EMAIL: {
                return "User input: e-mail";
            }
            case ElementType.WEB_INPUT_NUMBER: {
                return "User input: number";
            }
            case ElementType.WEB_INPUT_PHONE: {
                return "User input: phone number";
            }
            case ElementType.WEB_INPUT_PHONE: {
                return "User input: phone number";
            }
            default: {
                throw new Error(`Unsupported element type: ${element.type}`);
            }
        }
    };

    return (
        <Box>
            <FormControl fullWidth>
                <InputLabel id="block-selector-label">Block</InputLabel>
                <Select
                    labelId="block-selector-label"
                    value={blockId ?? ''}
                    label='Block'
                    onChange={handleBlockChange}
                >
                    {blocks.filter(b => b.elements.some(e => availableToDeleteElementTypes.includes(e.type))).map(b =>
                        (<MenuItem key={b.id} value={b.id}>{b.title}</MenuItem>)
                    )}
                </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginTop: 2 }} disabled={isNil(blockId) || messageElements.length === 0}>
                <InputLabel id="message-element-selector-label">Message</InputLabel>
                <Select
                    labelId="message-element-selector-label"
                    value={messageElementId ?? ''}
                    label='Message'
                    onChange={handleMessageElementChange}
                >
                    {messageElements.map(mElement =>
                        (<MenuItem sx={{ width: "536px" }} key={mElement.id} value={mElement.id}><div dangerouslySetInnerHTML={{ __html: getMessagePreview(mElement) }}></div></MenuItem>)
                    )}
                </Select>
            </FormControl>
        </Box>
    )
}
