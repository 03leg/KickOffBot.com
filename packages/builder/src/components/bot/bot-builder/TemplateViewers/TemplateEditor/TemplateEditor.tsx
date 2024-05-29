import { BotTemplate, BotVariable, VariableType } from '@kickoffbot.com/types';
import { Box, InputLabel, TextField } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { VariableSelector } from '../../FlowDesigner/components/VariableSelector';
import { TextEditor } from '../../FlowDesigner/components/elements/TextContent/TextEditor';
import { isNil } from 'lodash';
import { EditorState, convertFromRaw } from 'draft-js';
import { useFlowDesignerStore } from '../../store';

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

    const a = isNil(template.json) ? void 0 : EditorState.createWithContent(convertFromRaw(JSON.parse(template.json)));

    const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
        template.name = event.target.value;
        onTemplateChange(template);
    }, [onTemplateChange, template]);

    const handleContentChange = useCallback((jsonState: string, htmlContent: string, telegramContent: string) => {
        template.json = jsonState;
        template.htmlContent = htmlContent;
        template.telegramContent = telegramContent;
    }, [template]);

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

        if (isNil(variable) || variable.type !== VariableType.ARRAY || isNil(variable.arrayItemType) || variable.arrayItemType !== VariableType.OBJECT) {
            return undefined;
        }

        const result = ["index"];
        const values = JSON.parse(variable.value as string);
        const firstValue = values[0];

        result.push(...Object.keys(firstValue));


        return result;

    }, [contextVariableId, getVariableById]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: 1 }}>
            <TextField fullWidth label='Name' variant="outlined" value={name} onChange={handleNameChange} />
            <Box sx={{ mt: 2, mb: 2 }}>
                <VariableSelector variableTypes={[VariableType.ARRAY]} valueId={contextVariableId ?? ''} onVariableChange={handleVariableChange} />
            </Box>

            {!isNil(contextVariableId) &&
                <>
                    <InputLabel sx={{ marginBottom: 1, fontSize: '0.75rem' }}>Content for each array item</InputLabel>
                    <TextEditor onContentChange={handleContentChange} initialState={a} contextObjectProperties={contextObjectProperties} />
                </>
            }
        </Box>
    )
}
