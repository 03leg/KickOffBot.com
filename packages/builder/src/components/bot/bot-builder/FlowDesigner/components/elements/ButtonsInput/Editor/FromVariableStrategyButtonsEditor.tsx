import { BotVariable, VariableButtonsSourceStrategyDescription, VariableType, VariableValueSource } from '@kickoffbot.com/types';
import { Box, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo } from 'react'
import { ArrayPathSelectorComponent } from '../../../ArrayPathSelectorComponent';
import { TextTemplateEditor } from './TextTemplateEditor';
import { isNil } from 'lodash';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { VariableSelector } from '../../../VariableSelector';

interface Props {
    value?: VariableButtonsSourceStrategyDescription;
    onValueChange: (value: VariableButtonsSourceStrategyDescription) => void;
}

const isTypeMatching = (arrayItemType: VariableType, variableType: string | null): boolean => {
    switch (variableType) {
        case 'boolean':
            return arrayItemType === VariableType.BOOLEAN
        case 'number':
            return arrayItemType === VariableType.NUMBER
        case 'string':
            return arrayItemType === VariableType.STRING
        case 'object':
            return arrayItemType === VariableType.OBJECT
        default:
            return false
    }
}

export const FromVariableStrategyButtonsEditor = ({ value: defaultValue, onValueChange }: Props) => {
    const [value, setValue] = React.useState<VariableButtonsSourceStrategyDescription>(defaultValue ?? {} as VariableButtonsSourceStrategyDescription);

    console.log('value', value);

    const handleVariableValueSourceChange = useCallback((newValue: VariableValueSource) => {
        setValue((prevValue) => ({ ...prevValue, variableSource: newValue, customTextTemplate: undefined }));
    }, []);

    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    const handleCustomTemplateChange = useCallback((newValue: string) => {
        setValue((prevValue) => ({ ...prevValue, customTextTemplate: newValue }));
    }, []);

    useEffect(() => {
        onValueChange(value)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const propertyNames = useMemo(() => {
        if (isNil(value.variableSource)) {
            return null;
        }
        const { variableId, path } = value.variableSource;

        const variable = getVariableById(variableId);

        if (isNil(variable)) {
            return null;
        }

        const getSuitableKeys = (obj: Record<string, unknown>) => {
            const result = [];

            for(const key of Object.keys(obj)) {
                if(obj[key] instanceof Object) {
                    continue;
                }

                result.push(key);
            }

            return result;
        }

        const variableDefaultValue = JSON.parse(variable.value as string);
        if (variableDefaultValue instanceof Array && variableDefaultValue.length > 0) {
            const firstValueOfArray = variableDefaultValue[0];
            if (firstValueOfArray instanceof Object) {
                return getSuitableKeys(firstValueOfArray);
            }

            return ['value'];
        }

        if (variableDefaultValue instanceof Object && !isNil(path)) {
            const variableValue = JSON.parse(variable.value as string)[path];

            if (variableValue instanceof Array && variableValue.length > 0) {
                const firstValueOfArray = variableValue[0];
                if (firstValueOfArray instanceof Object) {
                    return getSuitableKeys(firstValueOfArray);
                }

                return ['value'];
            }
        }

        return null;
    }, [getVariableById, value.variableSource]);


    const arrayItemType = useMemo(() => {
        if (isNil(value.variableSource)) {
            return null;
        }
        const { variableId, path } = value.variableSource;

        const variable = getVariableById(variableId);

        if (isNil(variable)) {
            return null;
        }

        const variableDefaultValue = JSON.parse(variable.value as string);
        if (variableDefaultValue instanceof Array && variableDefaultValue.length > 0) {
            const firstValueOfArray = variableDefaultValue[0];
            if (firstValueOfArray instanceof Array) {
                return null;
            }

            return typeof firstValueOfArray;
        }

        if (variableDefaultValue instanceof Object && !isNil(path)) {
            const variableValue = JSON.parse(variable.value as string)[path];

            if (variableValue instanceof Array && variableValue.length > 0) {
                const firstValueOfArray = variableValue[0];
                if (firstValueOfArray instanceof Array) {
                    return null;
                }

                return typeof firstValueOfArray;
            }
        }

        return null;
    }, [getVariableById, value.variableSource]);

    const handleAnswerVariableChange = useCallback(({ id }: BotVariable) => {
        setValue((prevValue) => ({ ...prevValue, answerVariableId: id }));
    }, []);

    const handleCustomVariableFilter = useCallback((variable: BotVariable) => {

        if (isTypeMatching(variable.type, arrayItemType)) {
            return true;
        }

        return false;
    }, [arrayItemType])

    return (
        <Box sx={{ display: 'flex', marginTop: 1, flexDirection: 'column' }}>
            <ArrayPathSelectorComponent variableValueSource={value.variableSource} onVariableValueSourceChange={handleVariableValueSourceChange} />
            {propertyNames &&
                <>
                    <TextTemplateEditor value={value.customTextTemplate} onValueChange={handleCustomTemplateChange} propertyNames={propertyNames} />
                    <Typography sx={{ marginTop: 2, marginBottom: 1.5 }}>Save user input to variable:</Typography>
                    <VariableSelector valueId={value.answerVariableId} onVariableChange={handleAnswerVariableChange} onCustomVariableFilter={handleCustomVariableFilter} />
                </>
            }
        </Box>
    )
}
