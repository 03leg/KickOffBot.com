import { ArrayFilter, BotVariable, VariableType, VariableValueSource } from '@kickoffbot.com/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { VariableSelector } from '../../../../VariableSelector';
import { Box } from '@mui/material';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { ArrayFilterComponent } from './ArrayFilterComponent';
import { isEmpty, isNil } from 'lodash';
import { PropertySelector } from './condition/PropertySelector';
import { object } from 'zod';

interface Props {
    variableValueSource?: VariableValueSource;
    onVariableValueSourceChange: (variableValueSource: VariableValueSource) => void;
}

export const VariableValueSourceComponent = ({ variableValueSource, onVariableValueSourceChange }: Props) => {
    const [variableValueSourceLocal, setVariableValueSourceLocal] = useState<VariableValueSource>(variableValueSource ?? {} as VariableValueSource);

    const handleVariableChange = useCallback((variable: BotVariable) => {
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
            if (variable.type === VariableType.OBJECT && JSON.parse(variable.value as string) instanceof Object || (variable.type === VariableType.ARRAY && JSON.parse(variable.value as string) instanceof Array)) {
                return true;
            }
        }
        catch {
            console.error('Error parsing variable value');
        }

        return false;
    }, []);

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
                if (dataObject[propName] instanceof Array || typeof dataObject[propName] === 'object') {
                    result.push(propName);
                }
            }
        }
        return result;
    }, [selectedVariable]);

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
            {(arrayObject !== null) &&
                <ArrayFilterComponent arrayObject={arrayObject}
                    arrayFilter={variableValueSourceLocal.arrayFilter}
                    onArrayFilterChange={handleArrayFilterChange} />}
        </Box>
    )
}
