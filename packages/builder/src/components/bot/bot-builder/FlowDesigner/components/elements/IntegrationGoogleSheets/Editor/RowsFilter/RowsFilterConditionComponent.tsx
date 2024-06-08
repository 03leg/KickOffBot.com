import { ConditionOperator, LogicalOperator, SpreadSheetRowsFilterConditionItem } from '@kickoffbot.com/types';
import { Box, IconButton, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { LogicalOperatorComponent } from '../../../Condition/Editor/LogicalOperatorComponent';
import { OperatorSelector } from '../../../Condition/Editor/OperatorSelector';
import { PropertySelector } from '../../../ChangeVariable/Editor/VariableValueSource/condition/PropertySelector';
import { RowsFilterConditionValueEditor } from './RowsFilterConditionValueEditor';

interface Props {
    item: SpreadSheetRowsFilterConditionItem;
    showLogicalOperatorSelector: boolean;
    nextItemLogicalOperator: LogicalOperator;
    onNextItemLogicalOperatorChange: (value: LogicalOperator) => void;
    index: number;
    onDeleteCondition: (item: SpreadSheetRowsFilterConditionItem) => void;
    headers: string[];
}


export const RowsFilterConditionComponent = ({ item, index, onDeleteCondition, showLogicalOperatorSelector, nextItemLogicalOperator, onNextItemLogicalOperatorChange, headers }: Props) => {
    const [selectedPropertyName, setSelectedPropertyName] = useState<string | undefined>(item.header ?? undefined);
    const [conditionOperator, setConditionOperator] = useState<ConditionOperator | undefined>(item.operator ?? undefined);
    const [conditionValue, setConditionValue] = useState<string | number | boolean | undefined>(item.value);
    const [conditionVariableIdValue, setConditionVariableIdValue] = useState<string | undefined>(item.variableIdValue);
    const [pathVariableIdValue, setPathVariableIdValue] = useState<string | undefined>(item.pathVariableIdValue);

    const handleHeaderChange = useCallback((propName: string) => {
        setSelectedPropertyName(propName);
        item.header = propName;
    }, [item]);

    const handleConditionOperatorChange = useCallback((newOperator?: ConditionOperator) => {
        setConditionOperator(newOperator);
        item.operator = newOperator;
    }, [item]);

    const handleConditionValueChange = useCallback((value: string | number | boolean | undefined, isVariableId: boolean, pathVariableIdValue?: string) => {

        if (isVariableId === false) {
            setConditionValue(value);
            item.value = value;
        }
        else {
            item.variableIdValue = value as string;
            item.pathVariableIdValue = pathVariableIdValue;

            setConditionVariableIdValue(item.variableIdValue);
            setPathVariableIdValue(pathVariableIdValue);
        }
    }, [item]);

    return (
        <Box sx={{ padding: 2, paddingTop: 0 }}>
            <Typography variant='h6' sx={{ marginBottom: 1 }}>where #{index}
                <IconButton sx={{ marginLeft: 1 }} onClick={() => onDeleteCondition(item)}>
                    <DeleteIcon />
                </IconButton>
            </Typography>
            <PropertySelector label={'Column Header'} propsDataSource={headers} selectedPropertyName={selectedPropertyName} onPropertyNameChange={handleHeaderChange} />

            <OperatorSelector operator={conditionOperator} onOperatorChange={handleConditionOperatorChange} />
            <RowsFilterConditionValueEditor value={conditionValue} variableIdValue={conditionVariableIdValue}
                pathVariableIdValue={pathVariableIdValue}
                onConditionValueChange={handleConditionValueChange} />


            {showLogicalOperatorSelector && <LogicalOperatorComponent value={nextItemLogicalOperator} onValueChange={onNextItemLogicalOperatorChange} />}
        </Box>
    )
}
