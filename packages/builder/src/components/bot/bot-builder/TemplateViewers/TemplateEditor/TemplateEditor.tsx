import { BotPlatform, BotTemplate, BotVariable, VariableType } from '@kickoffbot.com/types';
import { Box, Checkbox, FormControlLabel, InputLabel, TextField } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { VariableSelector } from '../../FlowDesigner/components/VariableSelector';
import { TextEditor } from '../../FlowDesigner/components/elements/TextEditor';
import { isNil } from 'lodash';
import { EditorState, convertFromRaw } from 'draft-js';
import { useFlowDesignerStore } from '../../store';
import { WebTextEditor } from '~/components/commons/WebTextEditor';
import { getTemplateContent } from './TemplateEditor.utils';

interface Props {
    template: BotTemplate;
    onTemplateChange: (template: BotTemplate) => void;
}

export const TemplateEditor = ({ template, onTemplateChange }: Props) => {
    const [name, setName] = useState<string>(template.name);
    const [contextVariableId, setContextVariableId] = useState<string | undefined>(template.contextVariableId);
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));
    const { platform } = useFlowDesignerStore((state) => ({
        platform: state.platform
    }));
    const [showContentWhenArrayIsEmpty, setShowContentWhenArrayIsEmpty] = useState<boolean>(template.showContentWhenArrayIsEmpty ?? false);
    const [isPlainText, setIsPlainText] = useState<boolean>(template.isPlainText ?? false);

    const itemContent = isNil(template.json) ? void 0 : EditorState.createWithContent(convertFromRaw(JSON.parse(template.json)));
    const emptyArrayContent = isNil(template.emptyArrayJson) ? void 0 : EditorState.createWithContent(convertFromRaw(JSON.parse(template.emptyArrayJson)));

    const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
        template.name = event.target.value;
        onTemplateChange(template);
    }, [onTemplateChange, template]);

    const handleContentChange = useCallback((jsonState: string, htmlContent: string, telegramContent?: string) => {
        template.json = jsonState;
        template.htmlContent = getTemplateContent(htmlContent, isPlainText);
        template.telegramContent = telegramContent;
        onTemplateChange(template); //?
    }, [isPlainText, onTemplateChange, template]);

    const handleEmptyArrayContentChange = useCallback((jsonState: string, htmlContent: string, telegramContent?: string) => {
        template.emptyArrayJson = jsonState;
        template.emptyArrayHtmlContent = getTemplateContent(htmlContent, isPlainText);
        template.emptyArrayTelegramContent = telegramContent;
        onTemplateChange(template); //?
    }, [isPlainText, onTemplateChange, template]);

    const handleVariableChange = useCallback((newVariable: BotVariable) => {
        template.contextVariableId = newVariable.id;
        setContextVariableId(newVariable.id);
        onTemplateChange(template);
    }, [onTemplateChange, template]);

    const contextObjectProperties = useMemo(() => {
        if (isNil(contextVariableId)) {
            return undefined;
        }
        const variable = getVariableById(contextVariableId);

        if (isNil(variable) || variable.type !== VariableType.ARRAY) {
            return undefined;
        }

        const result = ["index"];

        if (variable.arrayItemType === VariableType.OBJECT) {
            const values = JSON.parse(variable.value as string);
            const firstValue = values[0];

            result.push(...Object.keys(firstValue));
        } else {
            result.push("value");
        }


        return result;

    }, [contextVariableId, getVariableById]);

    const handleShowContentChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setShowContentWhenArrayIsEmpty(event.target.checked);
        template.showContentWhenArrayIsEmpty = event.target.checked;
        onTemplateChange(template);
    }, [onTemplateChange, template]);


    const handleIsPlainTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setIsPlainText(event.target.checked);
        template.isPlainText = event.target.checked;

        if (event.target.checked && template.htmlContent) {
            template.htmlContent = getTemplateContent(template.htmlContent, true);

            if (template.emptyArrayHtmlContent && showContentWhenArrayIsEmpty) {
                template.emptyArrayHtmlContent = getTemplateContent(template.emptyArrayHtmlContent, true);
            }
        }

        onTemplateChange(template);
    }, [onTemplateChange, showContentWhenArrayIsEmpty, template]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: 1 }}>
            <TextField fullWidth label='Name' variant="outlined" value={name} onChange={handleNameChange} />
            <Box sx={{ mt: 2, mb: 1 }}>
                <VariableSelector variableTypes={[VariableType.ARRAY]} valueId={contextVariableId ?? ''} onVariableChange={handleVariableChange} />
            </Box>

            {!isNil(contextVariableId) &&
                <>
                    <FormControlLabel sx={{ marginTop: 0 }} control={<Checkbox checked={isPlainText} onChange={handleIsPlainTextChange} />} label="Without HTML tags" />
                    <InputLabel sx={{ marginBottom: 1, fontSize: '0.75rem' }}>Content for each array item</InputLabel>
                    {platform === BotPlatform.Telegram && <TextEditor showInsertTemplateButton={false} onContentChange={handleContentChange} initialState={itemContent} contextObjectProperties={contextObjectProperties} />}
                    {platform === BotPlatform.WEB && <WebTextEditor showInsertTemplateButton={false} onContentChange={handleContentChange} jsonState={template.json} contextObjectProperties={contextObjectProperties} />}
                    <FormControlLabel sx={{ marginTop: 2 }} control={<Checkbox checked={showContentWhenArrayIsEmpty} onChange={handleShowContentChange} />} label="Show content when array is empty" />
                    {showContentWhenArrayIsEmpty &&
                        <>
                            {platform === BotPlatform.Telegram && <TextEditor showInsertTemplateButton={false} onContentChange={handleEmptyArrayContentChange} initialState={emptyArrayContent} />}
                            {platform === BotPlatform.WEB && <WebTextEditor showInsertTemplateButton={false} onContentChange={handleEmptyArrayContentChange} jsonState={template.emptyArrayJson} />}
                        </>
                    }
                </>
            }
        </Box>
    )
}
