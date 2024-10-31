import { BotVariable, VariableType, WebMultipleChoiceUIElement } from '@kickoffbot.com/types';
import React, { useCallback, useMemo } from 'react'
import { useWebMultipleChoiceDynamicEditorStyles } from './WebMultipleChoiceDynamicEditor.style';
import { Box, IconButton, Typography } from '@mui/material';
import { VariableSelector } from '~/components/bot/bot-builder/FlowDesigner/components/VariableSelector';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { AppTextField } from '~/components/commons/AppTextField';
import { isNil } from 'lodash';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    element: WebMultipleChoiceUIElement;
}

export const WebMultipleChoiceDynamicEditor = ({ element }: Props) => {
    const { classes } = useWebMultipleChoiceDynamicEditorStyles();
    const [dataSourceVariableId, setDataSourceVariableId] = React.useState(element.dataSourceVariableId ?? '');
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));
    const [optionValue, setOptionValue] = React.useState(element.optionValue ?? '');
    const [optionTitle, setOptionTitle] = React.useState(element.optionTitle ?? '');
    const [defaultOptionsVariableId, setDefaultOptionsVariableId] = React.useState(element.defaultOptionsVariableId);


    const handleDataSourceVariableChange = useCallback((newVariable: BotVariable) => {
        setDataSourceVariableId(newVariable.id);
        element.dataSourceVariableId = newVariable.id;
    }, [element]);


    const variable = useMemo(() => {
        if (!dataSourceVariableId) {
            return null;
        }
        return getVariableById(dataSourceVariableId);
    }, [dataSourceVariableId, getVariableById]);

    const contextObjectProperties = useMemo(() => {
        if (isNil(dataSourceVariableId)) {
            return undefined;
        }
        const variable = getVariableById(dataSourceVariableId);

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
    }, [dataSourceVariableId, getVariableById]);

    const handleOptionValueChange = useCallback((newValue: string) => {
        setOptionValue(newValue);
        element.optionValue = newValue;
    }, [element]);

    const handleOptionTitleChange = useCallback((newValue: string) => {
        setOptionTitle(newValue);
        element.optionTitle = newValue;
    }, [element]);

    const handleInsertDefaultOptionsVariable = useCallback((variable: BotVariable) => {
        setDefaultOptionsVariableId(variable.id);
        element.defaultOptionsVariableId = variable.id;
        element.defaultOptions = undefined;
    }, [element]);

    const handleDeleteDefaultOptionsVariable = useCallback(() => {
        setDefaultOptionsVariableId(undefined);
        element.defaultOptionsVariableId = undefined;
    }, [element]);

    return (
        <Box className={classes.root}>

            <Typography sx={{ marginBottom: 1 }}>
                Select data source of options:
            </Typography>
            <VariableSelector valueId={dataSourceVariableId} variableTypes={[VariableType.ARRAY]} onVariableChange={handleDataSourceVariableChange} />

            {variable !== null &&
                <Box sx={{ marginTop: 2, width: "100%" }}>
                    <AppTextField label="Option value" value={optionValue} onValueChange={handleOptionValueChange} contextObjectProperties={contextObjectProperties} />
                </Box>
            }

            {variable !== null &&
                <Box sx={{ marginTop: 2, width: "100%" }}>
                    <AppTextField label="Option title" value={optionTitle} onValueChange={handleOptionTitleChange} contextObjectProperties={contextObjectProperties} />
                </Box>
            }

            <Typography sx={{ marginBottom: 1, marginTop: 2 }}>
                Select data source of initial selected options:
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', width: "100%" }}>
                <VariableSelector valueId={defaultOptionsVariableId} variableTypes={[VariableType.ARRAY]} onVariableChange={handleInsertDefaultOptionsVariable} />
                <IconButton sx={{ marginLeft: 1 }} onClick={handleDeleteDefaultOptionsVariable}>
                    <DeleteIcon />
                </IconButton>
            </Box>

        </Box>
    )
}
