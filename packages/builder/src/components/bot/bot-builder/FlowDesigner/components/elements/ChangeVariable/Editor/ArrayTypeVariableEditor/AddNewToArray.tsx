/* eslint-disable @typescript-eslint/no-unsafe-return */
import { AddValueToArrayDescription, AddValueToArraySource, LogicalOperator, PropertyConditionItem, ValuePathDescription, VariableType } from '@kickoffbot.com/types';
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { Box } from '@mui/material';
import { VariableSelectorForAddNewValueToArray } from './VariableSelectorForAddNewValueToArray';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { isNil } from 'lodash';
import { PropertyConditionsComponent } from '../VariableValueSource/PropertyConditionsComponent';

interface Props {
    jsonTypeOfArrayItem: Omit<VariableType, VariableType.ARRAY>;
    value: AddValueToArrayDescription | undefined;
    onValueChange: (newValue: AddValueToArrayDescription) => void;
}

// eslint-disable-next-line react/display-name
export const AddNewToArray = memo(({ value, onValueChange, jsonTypeOfArrayItem }: Props) => {
    const [addNewToArrayValue, setAddNewToArrayValue] = React.useState<AddValueToArrayDescription>(value ?? {} as AddValueToArrayDescription);

    useEffect(() => {
        onValueChange(addNewToArrayValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addNewToArrayValue])

    const handleValuePathChange = useCallback((newValue: ValuePathDescription) => {
        setAddNewToArrayValue({ ...addNewToArrayValue, source: AddValueToArraySource.Variable, variableSourceDescription: { path: newValue, } });
    }, [addNewToArrayValue]);

    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    const selectedVariable = useMemo(() => {
        return getVariableById(value?.variableSourceDescription?.path.variableId ?? '');
    }, [getVariableById, value?.variableSourceDescription?.path.variableId]);

    const itemOfArray = useMemo(() => {
        if (selectedVariable?.type === VariableType.ARRAY) {
            const arrayValue = JSON.parse(selectedVariable.value as string);
            if (arrayValue instanceof Array && arrayValue.length > 0) {
                return arrayValue[0];
            }

        }

        if ((selectedVariable?.type === VariableType.OBJECT && !isNil(value?.variableSourceDescription?.path.path))) {
            const arrayValue = JSON.parse(selectedVariable.value as string)[value?.variableSourceDescription?.path.path];
            if (arrayValue instanceof Array && arrayValue.length > 0) {
                return arrayValue[0];
            }
        }

        return null;
    }, [selectedVariable?.type, selectedVariable?.value, value?.variableSourceDescription?.path.path]);

    const handlePropertyConditionsChange = useCallback((conditions: PropertyConditionItem[]) => {
        setAddNewToArrayValue({
            ...addNewToArrayValue, variableSourceDescription:
            {
                ...addNewToArrayValue.variableSourceDescription!,
                extraFilter: { ...addNewToArrayValue.variableSourceDescription?.extraFilter, conditions }
            }
        });
    }, [addNewToArrayValue]);

    const handleLogicalOperatorChange = useCallback((logicalOperator: LogicalOperator) => {
        setAddNewToArrayValue({
            ...addNewToArrayValue, variableSourceDescription:
            {
                ...addNewToArrayValue.variableSourceDescription!,
                extraFilter: { ...addNewToArrayValue.variableSourceDescription?.extraFilter, logicalOperator }
            }
        })
    }, [addNewToArrayValue]);

    return (
        <Box sx={{ marginTop: 2 }}>
            <VariableSelectorForAddNewValueToArray value={value?.variableSourceDescription?.path} onValueChange={handleValuePathChange} jsonTypeOfArrayItem={jsonTypeOfArrayItem} />
            {!isNil(itemOfArray) &&
                <Box sx={{ marginTop: 2 }}>
                    <PropertyConditionsComponent arrayObject={itemOfArray}
                        conditions={addNewToArrayValue.variableSourceDescription?.extraFilter?.conditions}
                        logicalOperator={addNewToArrayValue.variableSourceDescription?.extraFilter?.logicalOperator ?? LogicalOperator.AND}
                        onPropertyConditionsChange={handlePropertyConditionsChange}
                        onLogicalOperatorChange={handleLogicalOperatorChange} />
                </Box>
            }
        </Box>
    )
});
