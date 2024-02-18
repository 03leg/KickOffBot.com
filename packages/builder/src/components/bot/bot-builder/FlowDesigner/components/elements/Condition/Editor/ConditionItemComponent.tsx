import React, { useCallback, useMemo, useState } from 'react'
import { VariableSelector } from '../../../VariableSelector'
import { Box } from '@mui/material'
import { BotVariable, ConditionItem, ConditionOperator, LogicalOperator, VariableType } from '@kickoffbot.com/types'
import { OperatorSelector } from './OperatorSelector'
import { ConditionValueEditor } from './ConditionValueEditor';
import { LogicalOperatorComponent } from './LogicalOperatorComponent'
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store'
import { isNil } from 'lodash'

interface Props {
    item: ConditionItem;
    showLogicalOperatorSelector: boolean;
    nextItemLogicalOperator: LogicalOperator;
    onNextItemLogicalOperatorChange: (value: LogicalOperator) => void;
}

export const ConditionItemComponent = ({ item, showLogicalOperatorSelector, nextItemLogicalOperator, onNextItemLogicalOperatorChange }: Props) => {
    const [selectedVariableId, setSelectedVariableId] = useState<BotVariable['id'] | undefined>(item.variableId ?? undefined);
    const [conditionOperator, setConditionOperator] = useState<ConditionOperator | undefined>(item.operator ?? undefined);
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));
    const [conditionValue, setConditionValue] = useState<string | number | boolean | undefined>(item.value);
    const [conditionVariableIdValue, setConditionVariableIdValue] = useState<string | undefined>(item.variableIdValue);

    const variableType = useMemo(() => {
        if (isNil(selectedVariableId)) {
            return null;
        }
        return getVariableById(selectedVariableId)?.type ?? null;
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

    return (
        <Box sx={{ padding: 2, paddingTop: 0 }}>
            <VariableSelector onVariableChange={handleVariableChange} valueId={item.variableId} />
            {variableType &&
                <>
                    <OperatorSelector variableType={variableType} operator={conditionOperator} onOperatorChange={handleConditionOperatorChange} />
                    <ConditionValueEditor variableType={variableType} value={conditionValue} variableIdValue={conditionVariableIdValue}
                        onConditionValueChange={handleConditionValueChange} />
                </>
            }
            {showLogicalOperatorSelector && <LogicalOperatorComponent value={nextItemLogicalOperator} onValueChange={onNextItemLogicalOperatorChange} />}
        </Box>
    )
}
