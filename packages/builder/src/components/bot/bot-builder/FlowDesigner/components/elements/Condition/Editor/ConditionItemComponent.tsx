import React, { useCallback, useMemo, useState } from 'react'
import { VariableSelector } from '../../../VariableSelector'
import { Box, IconButton, Typography } from '@mui/material'
import { BotVariable, ConditionItem, ConditionOperator, LogicalOperator, VariableType } from '@kickoffbot.com/types'
import { OperatorSelector } from './OperatorSelector'
import { ConditionValueEditor } from './ConditionValueEditor';
import { LogicalOperatorComponent } from './LogicalOperatorComponent'
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store'
import { isEmpty, isNil } from 'lodash';
import DeleteIcon from '@mui/icons-material/Delete';
import { PropertySelector } from '../../ChangeVariable/Editor/VariableValueSource/condition/PropertySelector'


interface Props {
    item: ConditionItem;
    showLogicalOperatorSelector: boolean;
    nextItemLogicalOperator: LogicalOperator;
    onNextItemLogicalOperatorChange: (value: LogicalOperator) => void;
    index: number;
    onDeleteCondition: (item: ConditionItem) => void;
}

function getVariableTypeBasedOnPath(path: string, json: string) {
    try {
        const jsonObj = JSON.parse(json);
        const value = jsonObj[path];

        switch (typeof value) {
            case 'string':
                return VariableType.STRING;
            case 'number':
                return VariableType.NUMBER;
            case 'boolean':
                return VariableType.BOOLEAN;
            default:
                return null;
        }
    }
    catch {
        return null;
    }
}

export const ConditionItemComponent = ({ item, showLogicalOperatorSelector, nextItemLogicalOperator, onNextItemLogicalOperatorChange, index, onDeleteCondition }: Props) => {
    const [selectedVariableId, setSelectedVariableId] = useState<BotVariable['id'] | undefined>(item.variableId ?? undefined);
    const [conditionOperator, setConditionOperator] = useState<ConditionOperator | undefined>(item.operator ?? undefined);
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));
    const [conditionValue, setConditionValue] = useState<string | number | boolean | undefined>(item.value);
    const [conditionVariableIdValue, setConditionVariableIdValue] = useState<string | undefined>(item.variableIdValue);
    const [pathValue, setPathValue] = useState<string | undefined>(item.path);

    const variableType = useMemo(() => {
        if (isNil(selectedVariableId)) {
            return null;
        }
        return getVariableById(selectedVariableId)?.type ?? null;
    }, [getVariableById, selectedVariableId]);

    const selectedVariable = useMemo(() => {
        if (isNil(selectedVariableId)) {
            return null;
        }
        return getVariableById(selectedVariableId) ?? null;
    }, [getVariableById, selectedVariableId]);

    const setDefaultValue = useCallback((variableType: VariableType) => {
        switch (variableType) {
            case VariableType.BOOLEAN: {
                setConditionValue(false);
                item.value = false;
                break;
            }
            case VariableType.STRING: {
                setConditionValue('');
                item.value = '';
                break;
            }
            case VariableType.NUMBER: {
                setConditionValue(0);
                item.value = 0;
                break;
            }
        }
    }, [item])

    const handleVariableChange = useCallback((selectedVariable: BotVariable) => {
        setSelectedVariableId(selectedVariable.id);
        item.variableId = selectedVariable.id;
        setDefaultValue(selectedVariable.type);
    }, [item, setDefaultValue]);

    const handleConditionOperatorChange = useCallback((newOperator?: ConditionOperator) => {
        setConditionOperator(newOperator);
        item.operator = newOperator;
    }, [item]);

    const handleConditionValueChange = useCallback((value: string | number | boolean | undefined, isVariableId: boolean) => {
        if (isVariableId === false) {
            setConditionValue(value);
            item.value = value;
        }
        else {
            item.variableIdValue = value as string;
            setConditionVariableIdValue(item.variableIdValue);

            if (value === undefined && variableType)
                setDefaultValue(variableType);
        }
    }, [item, setDefaultValue, variableType]);

    const handlePathPropertyChange = useCallback((propertyName: string) => {
        setPathValue(propertyName);
        item.path = propertyName;
    }, [item]);

    const availablePropsForPathValue = useMemo(() => {
        const result = [];
        try {
            const defaultValue = (isNil(selectedVariable) || isEmpty(selectedVariable.value)) ? null : JSON.parse(selectedVariable.value as string);
            const dataObject = defaultValue as Record<string, unknown>;

            if (typeof dataObject === 'object' && !isNil(dataObject)) {
                for (const propName of Object.keys(dataObject)) {
                    if (!isNil(dataObject[propName]) && (typeof dataObject[propName] === 'string' || typeof dataObject[propName] === 'number' || typeof dataObject[propName] === 'boolean')) {
                        result.push(propName);
                    }
                }
            }
        }
        catch (e) {
            console.error(e);
        }
        return result;
    }, [selectedVariable]);

    const sourceType = useMemo(() => {
        if (variableType === VariableType.BOOLEAN || variableType === VariableType.STRING || variableType === VariableType.NUMBER || variableType === VariableType.DATE_TIME) {
            return variableType;
        }

        if (variableType === VariableType.OBJECT && !isNil(pathValue)) {
            return getVariableTypeBasedOnPath(pathValue, selectedVariable?.value as string);
        }

        return null;
    }, [pathValue, selectedVariable?.value, variableType]);

    const handleCustomVariableFilter = useCallback((variable: BotVariable) => {
        if (variable.type === VariableType.ARRAY) {
            return false;
        }

        return true;
    }, []);

    return (
        <Box sx={{ padding: 2, paddingTop: 0 }}>
            <Typography variant='h6' sx={{ marginBottom: 1 }}>Condition #{index}
                <IconButton sx={{ marginLeft: 1 }} onClick={() => onDeleteCondition(item)}>
                    <DeleteIcon />
                </IconButton>
            </Typography>
            <VariableSelector onVariableChange={handleVariableChange} valueId={item.variableId} onCustomVariableFilter={handleCustomVariableFilter} />
            {variableType === VariableType.OBJECT &&
                <Box sx={{ marginTop: 2 }}>
                    <PropertySelector arrayObject={{}}
                        selectedPropertyName={pathValue}
                        onPropertyNameChange={handlePathPropertyChange}
                        propsDataSource={availablePropsForPathValue}
                    />
                </Box>}
            {sourceType &&
                <>
                    <OperatorSelector variableType={sourceType} operator={conditionOperator} onOperatorChange={handleConditionOperatorChange} />
                    <ConditionValueEditor variableType={sourceType} value={conditionValue} variableIdValue={conditionVariableIdValue}
                        onConditionValueChange={handleConditionValueChange} />
                </>
            }
            {showLogicalOperatorSelector && <LogicalOperatorComponent value={nextItemLogicalOperator} onValueChange={onNextItemLogicalOperatorChange} />}
        </Box>
    )
}
