import { ConditionOperator, VariableType } from '@kickoffbot.com/types';
import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { isNil } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getConditionOperatorLabelByType } from '../utils';

interface Props {
    variableType: VariableType;
    operator?: ConditionOperator;
    onOperatorChange: (value: ConditionOperator | undefined) => void;
}

export const OperatorSelector = ({ variableType, onOperatorChange, operator }: Props) => {
    const handleOperatorChange = useCallback((event: SelectChangeEvent<string>) => {
        const conditionOperator = event.target.value;
        if (isNil(conditionOperator)) {
            return;
        }
        onOperatorChange(conditionOperator as ConditionOperator)
    }, [onOperatorChange]);


    const dataSource = useMemo(() => {

        const result = [];
        result.push({ id: ConditionOperator.EQUAL_TO, label: getConditionOperatorLabelByType(ConditionOperator.EQUAL_TO) });
        result.push({ id: ConditionOperator.NOT_EQUAL_TO, label: getConditionOperatorLabelByType(ConditionOperator.NOT_EQUAL_TO) });


        switch (variableType) {
            case VariableType.NUMBER: {
                result.push({ id: ConditionOperator.GREATER_THAN, label: getConditionOperatorLabelByType(ConditionOperator.GREATER_THAN) });
                result.push({ id: ConditionOperator.LESS_THAN, label: getConditionOperatorLabelByType(ConditionOperator.LESS_THAN) });
                break
            }
            case VariableType.STRING: {
                result.push({ id: ConditionOperator.CONTAINS, label: getConditionOperatorLabelByType(ConditionOperator.CONTAINS) });
                result.push({ id: ConditionOperator.DOES_NOT_CONTAIN, label: getConditionOperatorLabelByType(ConditionOperator.DOES_NOT_CONTAIN) });
                result.push({ id: ConditionOperator.IS_EMPTY, label: getConditionOperatorLabelByType(ConditionOperator.IS_EMPTY) });
                result.push({ id: ConditionOperator.STARTS_WITH, label: getConditionOperatorLabelByType(ConditionOperator.STARTS_WITH) });
                result.push({ id: ConditionOperator.END_WITH, label: getConditionOperatorLabelByType(ConditionOperator.END_WITH) });
                result.push({ id: ConditionOperator.MATCHES_REGEX, label: getConditionOperatorLabelByType(ConditionOperator.MATCHES_REGEX) });
                result.push({ id: ConditionOperator.DOES_NOT_MATCHES_REGEX, label: getConditionOperatorLabelByType(ConditionOperator.DOES_NOT_MATCHES_REGEX) });
                break
            }
            case VariableType.BOOLEAN: {
                break;
            }
            default:
                {
                    throw new Error('NotImplementedError');
                }
        }

        return result;
    }, [variableType]);

    return (
        <FormControl fullWidth sx={{ marginTop: 2 }}>
            <Select
                value={operator}
                onChange={handleOperatorChange}
            >
                {dataSource.map(v =>
                    (<MenuItem key={v.id} value={v.id}>{v.label}</MenuItem>)
                )}
            </Select>
        </FormControl>
    )
}
