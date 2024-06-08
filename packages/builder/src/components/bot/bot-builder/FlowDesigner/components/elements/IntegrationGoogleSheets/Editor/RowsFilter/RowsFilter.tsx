import { LogicalOperator, SpreadSheetRowsFilterConditionItem } from '@kickoffbot.com/types';
import { Box, Button } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { RowsFilterConditionComponent } from './RowsFilterConditionComponent';


interface Props {
    googleSheetHeaders: string[];
    conditions?: SpreadSheetRowsFilterConditionItem[];
    logicalOperator?: LogicalOperator;
    onFilterConditionsChange: (conditions: SpreadSheetRowsFilterConditionItem[], logicalOperator: LogicalOperator) => void;
}

export const RowsFilter = ({ googleSheetHeaders, conditions, logicalOperator, onFilterConditionsChange }: Props) => {
    const [conditionItems, setConditionItems] = useState<SpreadSheetRowsFilterConditionItem[]>(conditions ?? []);
    const [nextItemLogicalOperator, setNextItemLogicalOperator] = useState<LogicalOperator>(logicalOperator ?? LogicalOperator.AND);

    const handleAddCondition = useCallback(() => {
        const newPropertyConditionItem = {
            id: v4(),
        } as SpreadSheetRowsFilterConditionItem;

        const newItems = [...conditionItems, newPropertyConditionItem];

        setConditionItems(newItems);
    }, [conditionItems]);

    const handleNextItemLogicalOperatorChange = useCallback((operator: LogicalOperator) => {
        setNextItemLogicalOperator(operator);
    }, []);


    const handleDeleteConditionItem = useCallback((item: SpreadSheetRowsFilterConditionItem) => {
        const newItems = conditionItems.filter(c => c !== item);
        setConditionItems(newItems);
    }, [conditionItems]);


    useEffect(() => {
        onFilterConditionsChange(conditionItems, nextItemLogicalOperator);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conditionItems, nextItemLogicalOperator])

    return (
        <Box>
            {conditionItems?.map((conditionItem, index) => <RowsFilterConditionComponent
                key={conditionItem.id}
                item={conditionItem}
                showLogicalOperatorSelector={index !== conditionItems.length - 1}
                nextItemLogicalOperator={nextItemLogicalOperator}
                onNextItemLogicalOperatorChange={handleNextItemLogicalOperatorChange}
                index={index + 1}
                onDeleteCondition={handleDeleteConditionItem}
                headers={googleSheetHeaders}
            />)}
            <Button sx={{ marginTop: 1 }} fullWidth onClick={handleAddCondition} variant='contained' size='small' color='success'>Add row filter</Button>
        </Box>
    )
}
