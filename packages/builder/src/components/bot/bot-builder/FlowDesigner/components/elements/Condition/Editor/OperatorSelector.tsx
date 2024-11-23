import { ConditionOperator, VariableType } from '@kickoffbot.com/types';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { isNil } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { getConditionOperatorLabelByType } from '../utils';

interface Props {
    variableType?: VariableType;
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
        const generalOperators = [{ id: ConditionOperator.EQUAL_TO, label: getConditionOperatorLabelByType(ConditionOperator.EQUAL_TO) }, { id: ConditionOperator.NOT_EQUAL_TO, label: getConditionOperatorLabelByType(ConditionOperator.NOT_EQUAL_TO) }]
        const numberOperators = [{ id: ConditionOperator.GREATER_THAN, label: getConditionOperatorLabelByType(ConditionOperator.GREATER_THAN) }, { id: ConditionOperator.LESS_THAN, label: getConditionOperatorLabelByType(ConditionOperator.LESS_THAN) }];
        const stringOperators = [
            { id: ConditionOperator.CONTAINS, label: getConditionOperatorLabelByType(ConditionOperator.CONTAINS) },
            { id: ConditionOperator.DOES_NOT_CONTAIN, label: getConditionOperatorLabelByType(ConditionOperator.DOES_NOT_CONTAIN) },
            { id: ConditionOperator.IS_EMPTY, label: getConditionOperatorLabelByType(ConditionOperator.IS_EMPTY) },
            { id: ConditionOperator.STARTS_WITH, label: getConditionOperatorLabelByType(ConditionOperator.STARTS_WITH) },
            { id: ConditionOperator.END_WITH, label: getConditionOperatorLabelByType(ConditionOperator.END_WITH) },
            { id: ConditionOperator.MATCHES_REGEX, label: getConditionOperatorLabelByType(ConditionOperator.MATCHES_REGEX) },
            { id: ConditionOperator.DOES_NOT_MATCHES_REGEX, label: getConditionOperatorLabelByType(ConditionOperator.DOES_NOT_MATCHES_REGEX) }
        ];

        if (isNil(variableType)) {
            return [...generalOperators, ...numberOperators, ...stringOperators];
        }

        const result = [];
        result.push(...generalOperators);


        switch (variableType) {
            case VariableType.NUMBER: {
                result.push(...numberOperators);
                break
            }
            case VariableType.STRING: {
                result.push(...stringOperators);
                break
            }
            case VariableType.BOOLEAN: {
                break;
            }
            case VariableType.DATE_TIME:{
                result.push(...numberOperators);
                break
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
            <InputLabel id="operator-selector-label">Operator</InputLabel>

            <Select
                labelId='operator-selector-label'
                label='Operator'
                value={operator ?? ''}
                onChange={handleOperatorChange}
            >
                {dataSource.map(v =>
                    (<MenuItem key={v.id} value={v.id}>{v.label}</MenuItem>)
                )}
            </Select>
        </FormControl>
    )
}
