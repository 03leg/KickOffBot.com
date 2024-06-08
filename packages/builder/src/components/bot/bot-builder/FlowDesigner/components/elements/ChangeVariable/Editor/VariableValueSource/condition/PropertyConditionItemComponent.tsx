import React, { useCallback, useMemo, useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { ConditionOperator, LogicalOperator, PropertyConditionItem, VariableType } from '@kickoffbot.com/types'
import { isNil } from 'lodash';
import DeleteIcon from '@mui/icons-material/Delete';
import { PropertySelector } from './PropertySelector';
import { OperatorSelector } from '../../../../Condition/Editor/OperatorSelector';
import { ConditionValueEditor } from '../../../../Condition/Editor/ConditionValueEditor';
import { LogicalOperatorComponent } from '../../../../Condition/Editor/LogicalOperatorComponent';

interface Props {
  item: PropertyConditionItem;
  showLogicalOperatorSelector: boolean;
  nextItemLogicalOperator: LogicalOperator;
  onNextItemLogicalOperatorChange: (value: LogicalOperator) => void;
  index: number;
  onDeleteCondition: (item: PropertyConditionItem) => void;
  arrayObject: unknown;
}


export const PropertyConditionItemComponent = ({ arrayObject, item, showLogicalOperatorSelector, nextItemLogicalOperator, onNextItemLogicalOperatorChange, index, onDeleteCondition }: Props) => {
  const [selectedPropertyName, setSelectedPropertyName] = useState<string | undefined>(item.propertyName ?? undefined);
  const [conditionOperator, setConditionOperator] = useState<ConditionOperator | undefined>(item.operator ?? undefined);
  const [conditionValue, setConditionValue] = useState<string | number | boolean | undefined>(item.value);
  const [conditionVariableIdValue, setConditionVariableIdValue] = useState<string | undefined>(item.variableIdValue);
  const [pathVariableIdValue, setPathVariableIdValue] = useState<string | undefined>(item.pathVariableIdValue);


  const pathItemType = useMemo(() => {
    if (typeof arrayObject === 'object') {
      if (isNil(selectedPropertyName)) {
        return null;
      }

      const obj = arrayObject as Record<string, unknown>;

      if (typeof obj[selectedPropertyName] === 'boolean') {
        return VariableType.BOOLEAN;
      }

      if (typeof obj[selectedPropertyName] === 'string') {
        return VariableType.STRING;
      }

      if (typeof obj[selectedPropertyName] === 'number') {
        return VariableType.NUMBER;
      }
    } else if (typeof arrayObject === 'boolean') {
      return VariableType.BOOLEAN;
    } else if (typeof arrayObject === 'string') {
      return VariableType.STRING;
    } else if (typeof arrayObject === 'number') {
      return VariableType.NUMBER;
    }

    return null;
  }, [arrayObject, selectedPropertyName]);

  const setDefaultValue = useCallback((value: unknown) => {
    switch (typeof value) {
      case  "boolean": {
        setConditionValue(false);
        item.value = false;
        break;
      }
      case "string": {
        setConditionValue('');
        item.value = '';
        break;
      }
      case "number": {
        setConditionValue(0);
        item.value = 0;
        break;
      }
    }
  }, [item])

  const handlePropertyNameChange = useCallback((propName: string) => {
    setSelectedPropertyName(propName);
    item.propertyName = propName;
    setDefaultValue((arrayObject as Record<string, unknown>)[propName]);
  }, [arrayObject, item, setDefaultValue]);

  const handleConditionOperatorChange = useCallback((newOperator?: ConditionOperator) => {
    setConditionOperator(newOperator);
    item.operator = newOperator;
  }, [item]);

  const handleConditionValueChange = useCallback((value: string | number | boolean | undefined, isVariableId: boolean, pathVariableIdValue?: string) => {
    console.log('handleConditionValueChange', value, isVariableId);
    if (isVariableId === false) {
      setConditionValue(value);
      item.value = value;
    }
    else {
      item.variableIdValue = value as string;
      item.pathVariableIdValue = pathVariableIdValue;

      setConditionVariableIdValue(item.variableIdValue);
      setPathVariableIdValue(pathVariableIdValue);


      if (value === undefined && pathItemType)
        setDefaultValue(pathItemType);
    }
  }, [item, setDefaultValue, pathItemType]);

  return (
    <Box sx={{ padding: 2, paddingTop: 0 }}>
      <Typography variant='h6' sx={{ marginBottom: 1 }}>where #{index}
        <IconButton sx={{ marginLeft: 1 }} onClick={() => onDeleteCondition(item)}>
          <DeleteIcon />
        </IconButton>
      </Typography>
      {typeof arrayObject === 'object' && <PropertySelector arrayObject={arrayObject as Record<string, unknown>} selectedPropertyName={selectedPropertyName} onPropertyNameChange={handlePropertyNameChange} />}
      {typeof arrayObject !== 'object' && <Typography sx={{ marginBottom: 1 }}>Array item</Typography>}

      {pathItemType &&
        <>
          <OperatorSelector variableType={pathItemType} operator={conditionOperator} onOperatorChange={handleConditionOperatorChange} />
          <ConditionValueEditor variableType={pathItemType} value={conditionValue} variableIdValue={conditionVariableIdValue}
          pathVariableIdValue={pathVariableIdValue}
            onConditionValueChange={handleConditionValueChange} />
        </>
      }
      {showLogicalOperatorSelector && <LogicalOperatorComponent value={nextItemLogicalOperator} onValueChange={onNextItemLogicalOperatorChange} />}
    </Box>
  )
}

