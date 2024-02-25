import { LogicalOperator, PropertyConditionItem } from '@kickoffbot.com/types';
import { Box, Button } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react'
import { PropertyConditionItemComponent } from './condition/PropertyConditionItemComponent';
import { v4 } from 'uuid';

interface Props {
    arrayObject: unknown;
    logicalOperator: LogicalOperator;
    conditions?: PropertyConditionItem[];
    onPropertyConditionsChange: (conditions: PropertyConditionItem[]) => void;
    onLogicalOperatorChange: (logicalOperator: LogicalOperator) => void;
}

export const PropertyConditionsComponent = ({ arrayObject, logicalOperator, conditions, onPropertyConditionsChange, onLogicalOperatorChange }: Props) => {
    const [conditionItems, setConditionItems] = useState<PropertyConditionItem[]>(conditions ?? []);
    const [nextItemLogicalOperator, setNextItemLogicalOperator] = useState<LogicalOperator>(logicalOperator ?? LogicalOperator.AND);

    const handleAddCondition = useCallback(() => {
        const newPropertyConditionItem = {
            id: v4(),
        } as PropertyConditionItem;

        const newItems = [...conditionItems, newPropertyConditionItem];

        setConditionItems(newItems);
        // element.items = newItems;
    }, [conditionItems]);

    const handleNextItemLogicalOperatorChange = useCallback((operator: LogicalOperator) => {
        setNextItemLogicalOperator(operator);
        // element.logicalOperator = operator;
    }, []);


    const handleDeleteConditionItem = useCallback((item: PropertyConditionItem) => {
        const newItems = conditionItems.filter(c => c !== item);
        setConditionItems(newItems);
        // element.items = newItems;
    }, [conditionItems]);

    useEffect(() => {
        onPropertyConditionsChange(conditionItems);
    }, [conditionItems, onPropertyConditionsChange])

    useEffect(() => {
        onLogicalOperatorChange(nextItemLogicalOperator);
    }, [nextItemLogicalOperator, onLogicalOperatorChange]);

    return (
        <Box>
            {conditionItems?.map((conditionItem, index) => <PropertyConditionItemComponent
                arrayObject={arrayObject}
                key={conditionItem.id}
                item={conditionItem}
                showLogicalOperatorSelector={index !== conditionItems.length - 1}
                nextItemLogicalOperator={nextItemLogicalOperator}
                onNextItemLogicalOperatorChange={handleNextItemLogicalOperatorChange}
                index={index + 1}
                onDeleteCondition={handleDeleteConditionItem}
            />)}
            <Button sx={{ marginTop: 3 }} fullWidth onClick={handleAddCondition} variant='contained' color='success'>Add condition</Button>
        </Box>
    )
}
