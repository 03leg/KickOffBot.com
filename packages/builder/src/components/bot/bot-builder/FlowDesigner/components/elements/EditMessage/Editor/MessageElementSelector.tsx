import { ContentTextUIElement, ElementType, FlowDesignerUIBlockDescription } from '@kickoffbot.com/types';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { isNil } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';

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

        return blocks.find(b => b.id === blockId)?.elements.filter(e => e.type === ElementType.CONTENT_TEXT) ?? [];
    }, [blockId, blocks]);


    const getMessagePreview = (element: ContentTextUIElement) => {
        let html = element.telegramContent;
        if (isNil(html)) {
            return html;
        }

        const matches = html.matchAll(/&lt;%variables.(.*?)%&gt;/g);

        for (const m of matches) {
            const value = m[1];
            html = isNil(value) ? html : html.replace(m[0], `${value}`);
        }

        return html.slice(0, 60) + (html.length > 60 ? '...' : '');
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
                    {blocks.filter(b => b.elements.some(e => e.type === ElementType.CONTENT_TEXT)).map(b =>
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
                        (<MenuItem sx={{ width: "536px" }} key={mElement.id} value={mElement.id}>{getMessagePreview(mElement as ContentTextUIElement)}</MenuItem>)
                    )}
                </Select>
            </FormControl>
        </Box>
    )
}
