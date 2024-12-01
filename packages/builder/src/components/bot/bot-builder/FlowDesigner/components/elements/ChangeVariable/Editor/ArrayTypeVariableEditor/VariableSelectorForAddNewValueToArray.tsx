import { Box } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { VariableSelector } from '../../../../VariableSelector'
import { BotVariable, ValuePathDescription, VariableType } from '@kickoffbot.com/types';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { PropertySelector } from '../VariableValueSource/condition/PropertySelector';
import { throwIfNil } from '~/utils/guard';

interface Props {
    jsonTypeOfArrayItem: Omit<VariableType, VariableType.ARRAY>;
    value?: ValuePathDescription;
    onValueChange: (valuePathDescription: ValuePathDescription) => void;
}

const isMatchType = (value: unknown, type: VariableType) => {
    switch (type) {
        case VariableType.BOOLEAN: {
            return typeof value === 'boolean';
        }
        case VariableType.NUMBER: {
            return typeof value === 'number';
        }
        case VariableType.STRING: {
            return typeof value === 'string';
        }
        case VariableType.OBJECT: {
            return typeof value === 'object';
        }
        case VariableType.ARRAY: {
            return Array.isArray(value);
        }
        default:
            {
                return false;
            }
    }
};

export const VariableSelectorForAddNewValueToArray = ({ value, onValueChange, jsonTypeOfArrayItem }: Props) => {
    const [valuePathDescriptionValue, setValuePathDescriptionValue] = useState<ValuePathDescription>(value ?? { variableId: '' });
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));


    const handleCustomVariableFilter = useCallback((variable: BotVariable) => {
        if (variable.type === VariableType.OBJECT ||
            (variable.type === VariableType.ARRAY && variable.arrayItemType === jsonTypeOfArrayItem) ||
            variable.type === jsonTypeOfArrayItem) {
            return true;
        }
        return false;
    }, [jsonTypeOfArrayItem]);

    const handleVariableChange = useCallback((variable?: BotVariable) => {
        throwIfNil(variable);
        setValuePathDescriptionValue({ variableId: variable.id, path: undefined });
    }, [])


    useEffect(() => {
        onValueChange(valuePathDescriptionValue);
    }, [valuePathDescriptionValue]);

    const selectedVariable = useMemo(() => {
        return getVariableById(valuePathDescriptionValue.variableId);
    }, [getVariableById, valuePathDescriptionValue.variableId]);

    const handlePropertyOfObjectChange = useCallback((propertyName: string) => {
        setValuePathDescriptionValue({ ...valuePathDescriptionValue, path: propertyName });
    }, [valuePathDescriptionValue]);

    const availableProps = useMemo(() => {
        const result: string[] = [];

        if (selectedVariable?.type === VariableType.OBJECT) {
            const objectSample = JSON.parse(selectedVariable?.value as string ?? {});

            for (const key in objectSample) {
                const propValue = objectSample[key];

                if (propValue instanceof Array) {
                    if (propValue.length === 0) {
                        continue;
                    }

                    const firstValueOfArray = propValue[0];
                    if (!isMatchType(firstValueOfArray, jsonTypeOfArrayItem as VariableType)) {
                        continue;
                    }
                }

                if (!isMatchType(propValue, jsonTypeOfArrayItem as VariableType)) {
                    continue;
                }

                result.push(key);
            }

        }

        return result;
    }, [jsonTypeOfArrayItem, selectedVariable?.type, selectedVariable?.value]);

    return (
        <Box>
            <VariableSelector valueId={valuePathDescriptionValue.variableId}
                onVariableChange={handleVariableChange}
                onCustomVariableFilter={handleCustomVariableFilter} />
            {selectedVariable?.type === VariableType.OBJECT && availableProps.length !== 0 &&
                <Box sx={{ marginTop: 2 }}>
                    <PropertySelector arrayObject={{}} selectedPropertyName={valuePathDescriptionValue.path} onPropertyNameChange={handlePropertyOfObjectChange} propsDataSource={availableProps} />
                </Box>}
        </Box>
    )
}
