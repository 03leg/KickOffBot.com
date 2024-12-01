import { ArrayFilter, BotVariable, VariableType, VariableValueSource } from '@kickoffbot.com/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { VariableSelector } from '../../../../VariableSelector';
import { Box } from '@mui/material';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { ArrayFilterComponent } from './ArrayFilterComponent';
import { isEmpty, isNil } from 'lodash';
import { PropertySelector } from './condition/PropertySelector';
import { throwIfNil } from '~/utils/guard';

interface Props {
    variableValueSource?: VariableValueSource;
    onVariableValueSourceChange: (variableValueSource: VariableValueSource) => void;
    filterVariableType: VariableType;
}

export const VariableValueSourceComponent = ({ variableValueSource, onVariableValueSourceChange, filterVariableType }: Props) => {
    const [variableValueSourceLocal, setVariableValueSourceLocal] = useState<VariableValueSource>(variableValueSource ?? {} as VariableValueSource);

    const handleVariableChange = useCallback((variable?: BotVariable) => {
        throwIfNil(variable);
        setVariableValueSourceLocal({ variableId: variable.id, });
    }, []);

    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    const selectedVariable = useMemo(() => {
        return getVariableById(variableValueSourceLocal.variableId);
    }, [getVariableById, variableValueSourceLocal.variableId])

    const handleCustomVariableFilter = useCallback((variable: BotVariable) => {
        try {
            if (variable.type === VariableType.OBJECT && JSON.parse(variable.value as string) instanceof Object) {
                return true;
            }

            if ((variable.type === VariableType.ARRAY && JSON.parse(variable.value as string) instanceof Array)) {
                const defaultValue = JSON.parse(variable.value as string) as unknown[];
                if (defaultValue.length > 0 && (typeof defaultValue[0] === 'object' && filterVariableType === VariableType.OBJECT)) {
                    return true;
                }

            }
        }
        catch {
            console.error('Error parsing variable value');
        }

        return false;
    }, [filterVariableType]);

    const arrayObject = useMemo(() => {
        const defaultValue = (isNil(selectedVariable) || isEmpty(selectedVariable.value)) ? null : JSON.parse(selectedVariable.value as string);

        if (defaultValue instanceof Array && defaultValue.length >= 1) {
            return defaultValue[0] as unknown;
        }

        if (defaultValue !== null && !isNil(variableValueSource?.path) && (defaultValue as Record<string, unknown>)[variableValueSource?.path] instanceof Array) {
            const items = (defaultValue as Record<string, unknown>)[variableValueSource?.path] as object[];

            if (items.length > 0) {
                return (items)[0];
            }
        }

        return null;
    }, [selectedVariable, variableValueSource?.path]);

    const isSuitableSourceType = useMemo(() => {
        if (isNil(arrayObject)) {
            return false;
        }

        if (filterVariableType === VariableType.OBJECT) {
            if (typeof arrayObject === 'object') {
                return true;
            }
        }

        return false;
    }, [arrayObject, filterVariableType])

    useEffect(() => {
        onVariableValueSourceChange(variableValueSourceLocal);
    }, [onVariableValueSourceChange, variableValueSourceLocal]);


    const handleArrayFilterChange = useCallback((arrayFilter: ArrayFilter) => {
        setVariableValueSourceLocal({ ...variableValueSourceLocal, arrayFilter });
    }, [variableValueSourceLocal])

    const handlePathPropertyChange = useCallback((propertyName: string) => {
        setVariableValueSourceLocal({ ...variableValueSourceLocal, path: propertyName })
    }, [variableValueSourceLocal]);


    const availableProps = useMemo(() => {
        const result = [];
        const defaultValue = (isNil(selectedVariable) || isEmpty(selectedVariable.value)) ? null : JSON.parse(selectedVariable.value as string);
        const dataObject = defaultValue as Record<string, unknown>;

        if (typeof dataObject === 'object' && !isNil(dataObject)) {
            for (const propName of Object.keys(dataObject)) {
                if (!isNil(dataObject[propName]) && (dataObject[propName] instanceof Array ||
                    (typeof dataObject[propName] === 'object' && filterVariableType === VariableType.OBJECT))) {
                    result.push(propName);
                }
            }
        }
        return result;
    }, [filterVariableType, selectedVariable]);

    return (
        <Box sx={{ marginTop: 2 }}>
            <VariableSelector valueId={variableValueSourceLocal.variableId} onVariableChange={handleVariableChange} onCustomVariableFilter={handleCustomVariableFilter} />
            {selectedVariable?.type === VariableType.OBJECT &&
                <Box sx={{ marginTop: 2 }}>
                    <PropertySelector arrayObject={{}}
                        selectedPropertyName={variableValueSourceLocal.path}
                        onPropertyNameChange={handlePathPropertyChange}
                        propsDataSource={availableProps}
                    />
                </Box>}
            {(arrayObject !== null && isSuitableSourceType) &&
                <ArrayFilterComponent arrayObject={arrayObject}
                    arrayFilter={variableValueSourceLocal.arrayFilter}
                    onArrayFilterChange={handleArrayFilterChange} />}
        </Box>
    )
}
