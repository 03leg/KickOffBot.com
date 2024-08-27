import { BotVariable, GoogleSheetsIntegrationUIElement, LogicalOperator, SpreadSheetRowsFilterConditionItem, UpdateRowsFromObjectVariableDescription, VariableType } from '@kickoffbot.com/types';
import { Box, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { VariableSelector } from '../../../VariableSelector';
import { RowsFilter } from './RowsFilter/RowsFilter';

interface Props {
    googleSheetHeaders: string[];
    element: GoogleSheetsIntegrationUIElement;
}

export const UpdateRowsFromVariableEditor = ({ element, googleSheetHeaders }: Props) => {
    const [selectedVariableId, setSelectedVariableId] = useState<BotVariable["id"]>(element.dataOperationDescription?.variableId ?? '');
    const updateRowsDescription = element?.dataOperationDescription as UpdateRowsFromObjectVariableDescription;

    const handleVariableChange = useCallback((variable: BotVariable) => {
        setSelectedVariableId(variable.id);
        element.dataOperationDescription = {
            variableId: variable.id,
            filter: updateRowsDescription?.filter
        };
    }, [element, updateRowsDescription?.filter]);


    const handleVariableFilter = useCallback((variable: BotVariable) => {
        if (variable.type !== VariableType.OBJECT) {
            return false;
        }

        try {
            const value = JSON.parse(variable.value as string);
            return googleSheetHeaders.some(header => Object.keys(value).includes(header));
        }
        catch {
            return false;
        }
    }, [googleSheetHeaders]);


    const handleFilterConditionsChange = useCallback((conditions: SpreadSheetRowsFilterConditionItem[], logicalOperator: LogicalOperator) => {
        element.dataOperationDescription = {
            variableId: selectedVariableId,
            filter: {
                conditions: conditions,
                operator: logicalOperator
            }
        };
    }, [element, selectedVariableId]);




    return (
        <Box>
            <Box sx={{ marginBottom: 2, marginTop: 3 }}>
                <VariableSelector label="Variable with new values" valueId={selectedVariableId} onVariableChange={handleVariableChange} onCustomVariableFilter={handleVariableFilter} />
            </Box>
            <Typography variant='h6' sx={{ marginBottom: 2, }}>Set in rows:</Typography>
            <RowsFilter conditions={updateRowsDescription?.filter?.conditions} onFilterConditionsChange={handleFilterConditionsChange} googleSheetHeaders={googleSheetHeaders} />

        </Box>
    )
}
