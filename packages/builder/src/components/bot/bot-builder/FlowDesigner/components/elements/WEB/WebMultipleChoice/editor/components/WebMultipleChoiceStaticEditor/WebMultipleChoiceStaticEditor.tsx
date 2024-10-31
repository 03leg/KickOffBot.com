import { BotVariable, WebMultipleChoiceUIElement } from '@kickoffbot.com/types';
import { Autocomplete, Box, IconButton, TextField } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useInsertVariableToText } from '../../../../../ChangeVariable/Editor/useInsertVariableToText';
import { VariableSelectorDialog } from '~/components/bot/bot-builder/FlowDesigner/components/VariableSelectorDialog';
import { useWebMultipleChoiceStaticEditorStyles } from './WebMultipleChoiceStaticEditor.style';
import { isNil } from 'lodash';
import { useVariableInTextStyles } from '../../../../../ChangeVariable/useContentWithVariable';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import DeleteIcon from '@mui/icons-material/Delete';


interface Props {
    element: WebMultipleChoiceUIElement;
}


export const WebMultipleChoiceStaticEditor = ({ element }: Props) => {
    const { classes } = useWebMultipleChoiceStaticEditorStyles();
    const [optionsText, setOptionsText] = React.useState(element.optionsText ?? '');
    const [defaultOptions, setDefaultOptions] = React.useState(element.defaultOptions ?? []);
    const [defaultOptionsVariableId, setDefaultOptionsVariableId] = React.useState(element.defaultOptionsVariableId);
    const { classes: variableClasses } = useVariableInTextStyles();
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    const handleOptionsTextChange = useCallback((newValue: string) => {
        setOptionsText(newValue);
        element.optionsText = newValue;
    }, [element]);

    const { handleInsertVariable, inputRef, updateSelectionStart } = useInsertVariableToText(optionsText, (value) => {
        handleOptionsTextChange(value);
    });

    const availableOptions = useMemo(() => {
        return optionsText.split('\n').filter((option) => option !== '');
    }, [optionsText]);

    const handleInsertDefaultOptionsVariable = useCallback((variable: BotVariable) => {
        setDefaultOptionsVariableId(variable.id);
        element.defaultOptionsVariableId = variable.id;
        element.defaultOptions = undefined;
    }, [element]);

    const handleDefaultOptionsChange = useCallback((event: unknown, newValue: string[]) => {
        setDefaultOptions(newValue);
        element.defaultOptions = newValue;
    }, [element]);

    const defaultOptionsVariable = useMemo(() => {
        if (!defaultOptionsVariableId) {
            return null;
        }

        return getVariableById(defaultOptionsVariableId);
    }, [defaultOptionsVariableId, getVariableById]);

    const handleDeleteDefaultOptionsVariable = useCallback(() => {
        setDefaultOptionsVariableId(undefined);
        element.defaultOptionsVariableId = undefined;
    }, [element]);

    return (
        <Box className={classes.root}>
            <Box className={classes.row}>
                <TextField
                    label="Options"
                    multiline
                    rows={8}
                    value={optionsText}
                    onChange={(e) => handleOptionsTextChange(e.target.value)}
                    sx={{ flex: 1 }}
                    inputRef={inputRef}
                    onSelect={updateSelectionStart}
                    placeholder={'option1\noption2\noption3\noption4'}
                    InputLabelProps={{
                        shrink: true
                    }}
                />
                <Box sx={{ marginLeft: 1 }}>
                    <VariableSelectorDialog onInsertVariable={handleInsertVariable} supportPathForObject={false} />
                </Box>
            </Box>
            <Box className={classes.row}>
                {isNil(defaultOptionsVariableId) && <>
                    <Autocomplete
                        multiple
                        options={availableOptions}
                        value={defaultOptions}
                        fullWidth
                        disabled={availableOptions.length === 0}
                        onChange={handleDefaultOptionsChange}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="Initial selected options" />
                        )}
                    />
                    <Box sx={{ marginLeft: 1, display: 'flex', alignItems: 'center' }}>
                        <VariableSelectorDialog onInsertVariable={handleInsertDefaultOptionsVariable} supportPathForObject={false} />
                    </Box>
                </>}

                {!isNil(defaultOptionsVariableId) && defaultOptionsVariable && <Box>
                    initial selected options from variable <span className={variableClasses.variable}>{defaultOptionsVariable?.name}</span>
                    <IconButton sx={{ marginLeft: 1 }} onClick={handleDeleteDefaultOptionsVariable}>
                        <DeleteIcon />
                    </IconButton>
                </Box>}
            </Box>
        </Box>
    )
}
