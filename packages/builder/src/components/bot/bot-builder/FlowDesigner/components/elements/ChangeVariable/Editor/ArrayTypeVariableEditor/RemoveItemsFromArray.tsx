import { LogicalOperator, PropertyConditionItem, RemoveItemFromArrayMode, RemoveItemsFromArrayDescription } from '@kickoffbot.com/types';
import { Box, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React, { useCallback, useEffect } from 'react'
import { PropertyConditionsComponent } from '../VariableValueSource/PropertyConditionsComponent';

interface Props {
    itemOfArray: unknown;
    value: RemoveItemsFromArrayDescription | undefined;
    onValueChange: (newValue: RemoveItemsFromArrayDescription) => void;
}

export const RemoveItemsFromArray = ({ value, onValueChange, itemOfArray }: Props) => {
    const [removeItemsFromArrayValue, setRemoveItemsFromArrayValue] = React.useState<RemoveItemsFromArrayDescription>(value ?? { conditions: [], mode: RemoveItemFromArrayMode.ALL } as RemoveItemsFromArrayDescription);

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

    const handleRemoveModeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value as RemoveItemFromArrayMode;
        setRemoveItemsFromArrayValue({ ...removeItemsFromArrayValue, mode: newValue });
    }, [removeItemsFromArrayValue]);

    return (
        <Box>
            <RadioGroup sx={{ ml: 3.5 }} value={removeItemsFromArrayValue.mode} onChange={handleRemoveModeChange}>
                <FormControlLabel value={RemoveItemFromArrayMode.ALL} control={<Radio />} label="All items" />
                <FormControlLabel value={RemoveItemFromArrayMode.FIRST} control={<Radio />} label="First item" />
                <FormControlLabel value={RemoveItemFromArrayMode.LAST} control={<Radio />} label="Last item" />
                <FormControlLabel value={RemoveItemFromArrayMode.RANDOM} control={<Radio />} label="Random item" />
            </RadioGroup>
            <PropertyConditionsComponent arrayObject={itemOfArray}
                conditions={removeItemsFromArrayValue.conditions}
                logicalOperator={removeItemsFromArrayValue.logicalOperator ?? LogicalOperator.AND}
                onPropertyConditionsChange={handlePropertyConditionsChange}
                onLogicalOperatorChange={handleLogicalOperatorChange} />
        </Box>
    )
}
