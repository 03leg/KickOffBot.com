import { LogicalOperator, PropertyConditionItem, RemoveItemsFromArrayDescription, VariableType } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react'
import { PropertyConditionsComponent } from '../VariableValueSource/PropertyConditionsComponent';

interface Props {
    itemOfArray: unknown;
    value: RemoveItemsFromArrayDescription | undefined;
    onValueChange: (newValue: RemoveItemsFromArrayDescription) => void;
}

export const RemoveItemsFromArray = ({ value, onValueChange, itemOfArray }: Props) => {
    const [removeItemsFromArrayValue, setRemoveItemsFromArrayValue] = React.useState<RemoveItemsFromArrayDescription>(value ?? { conditions: [] } as RemoveItemsFromArrayDescription);

    useEffect(() => {
        onValueChange(removeItemsFromArrayValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [removeItemsFromArrayValue]);


    const handlePropertyConditionsChange = useCallback((conditions: PropertyConditionItem[]) => {
        setRemoveItemsFromArrayValue({ ...removeItemsFromArrayValue, conditions })
    }, [removeItemsFromArrayValue]);

    const handleLogicalOperatorChange = useCallback((logicalOperator: LogicalOperator) => {
        setRemoveItemsFromArrayValue({ ...removeItemsFromArrayValue, logicalOperator })
    }, [removeItemsFromArrayValue]);

    return (
        <Box>
            <PropertyConditionsComponent arrayObject={itemOfArray}
                conditions={removeItemsFromArrayValue.conditions}
                logicalOperator={removeItemsFromArrayValue.logicalOperator ?? LogicalOperator.AND}
                onPropertyConditionsChange={handlePropertyConditionsChange}
                onLogicalOperatorChange={handleLogicalOperatorChange} />
        </Box>
    )
}
