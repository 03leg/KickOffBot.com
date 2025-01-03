import { CardVisibilityCondition, ConditionItem, ConditionUIElement, LogicalOperator } from '@kickoffbot.com/types';
import { Box, Button } from '@mui/material';
import React, { useCallback, useState } from 'react'
import { ConditionItemComponent } from './ConditionItemComponent';
import { v4 } from 'uuid';
interface Props {
    element: ConditionUIElement | CardVisibilityCondition;
}

export const ConditionEditor = ({ element }: Props) => {
    const [conditionItems, setConditionItems] = useState<ConditionItem[]>(element.items ?? []);
    const [nextItemLogicalOperator, setNextItemLogicalOperator] = useState<LogicalOperator>(element.logicalOperator ?? LogicalOperator.AND);

    const handleAddCondition = useCallback(() => {
        const newConditionItem = {
            id: v4(),
        } as ConditionItem;

        const newItems = [...conditionItems, newConditionItem];

        setConditionItems(newItems);
        element.items = newItems;
    }, [conditionItems, element]);

    const handleNextItemLogicalOperatorChange = useCallback((operator: LogicalOperator) => {
        setNextItemLogicalOperator(operator);
        element.logicalOperator = operator;
    }, [element]);


    const handleDeleteConditionItem = useCallback((item: ConditionItem) => {
        const newItems = conditionItems.filter(c => c !== item);
        setConditionItems(newItems);
        element.items = newItems;
    }, [conditionItems, element]);

    return (
        <Box>
            {conditionItems.map((conditionItem, index) => <ConditionItemComponent
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
