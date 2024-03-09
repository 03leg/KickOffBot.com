import { ArrayFilter, BotVariable, VariableType, VariableValueSource } from '@kickoffbot.com/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { isEmpty, isNil } from 'lodash';
import { VariableSelector } from '../VariableSelector';
import { PropertySelector } from '../elements/ChangeVariable/Editor/VariableValueSource/condition/PropertySelector';

interface Props {
    variableValueSource?: VariableValueSource;
    onVariableValueSourceChange: (variableValueSource: VariableValueSource, isValid: boolean) => void;
}


export const ArrayPathSelectorComponent = ({ variableValueSource, onVariableValueSourceChange }: Props) => {
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
            if (variable.type === VariableType.OBJECT && JSON.parse(variable.value as string) instanceof Object) {

                // check if object has properties with array type
                const defaultValue = JSON.parse(variable.value as string) as Record<string, unknown>;
                for(const propName of Object.keys(defaultValue)) {
                    if (!isNil(defaultValue[propName]) && (defaultValue[propName] instanceof Array)) {
                        return true;
                    }
                }

                return false;
            }

            if ((variable.type === VariableType.ARRAY && JSON.parse(variable.value as string) instanceof Array)) {
                return true;
            }
        }
        catch {
            console.error('Error parsing variable value');
        }

        return false;
    }, []);

    // const isValid = useCallback((variableValueSource: VariableValueSource) => {
    //     return !isNil(variableValueSource.variableId)
    // }, []);


    useEffect(() => {
        // const valueIsValid = isValid(variableValueSourceLocal);
        if(variableValueSourceLocal !== variableValueSource){
            onVariableValueSourceChange(variableValueSourceLocal, true);
        }
    }, [onVariableValueSourceChange, variableValueSource, variableValueSourceLocal]);


    const handlePathPropertyChange = useCallback((propertyName: string) => {
        setVariableValueSourceLocal({ ...variableValueSourceLocal, path: propertyName })
    }, [variableValueSourceLocal]);


    const availableProps = useMemo(() => {
        const result = [];
        const defaultValue = (isNil(selectedVariable) || isEmpty(selectedVariable.value)) ? null : JSON.parse(selectedVariable.value as string);
        const dataObject = defaultValue as Record<string, unknown>;

        if (typeof dataObject === 'object' && !isNil(dataObject)) {
            for (const propName of Object.keys(dataObject)) {
                if (!isNil(dataObject[propName]) && (dataObject[propName] instanceof Array)) {
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
        </Box>
    )
}
