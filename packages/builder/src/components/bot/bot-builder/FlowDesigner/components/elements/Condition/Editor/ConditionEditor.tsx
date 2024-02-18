import { ConditionItem, ConditionUIElement, LogicalOperator } from '@kickoffbot.com/types';
import { Box, Button } from '@mui/material';
import React, { useCallback, useState } from 'react'
import { ConditionItemComponent } from './ConditionItemComponent';
import { v4 } from 'uuid';
interface Props {
    element: ConditionUIElement;
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

    return (
        <Box>
            {conditionItems.map((conditionItem, index) => <ConditionItemComponent
                key={conditionItem.id}
                item={conditionItem}
                showLogicalOperatorSelector={index !== conditionItems.length - 1}
                nextItemLogicalOperator={nextItemLogicalOperator}
                onNextItemLogicalOperatorChange={handleNextItemLogicalOperatorChange}
            />)}
            <Button sx={{ marginTop: 3 }} fullWidth onClick={handleAddCondition} variant='contained' color='success'>Add condition</Button>
        </Box>
    )
}
