import { BotVariable, GoogleSheetsIntegrationUIElement, VariableType } from '@kickoffbot.com/types';
import { Alert, Box } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { VariableSelector } from '../../../VariableSelector';
import { throwIfNil } from '~/utils/guard';
import { getExportObjectNewVariableTemplate } from './newVariableTemplate.utils';

interface Props {
    googleSheetHeaders: string[];
    element: GoogleSheetsIntegrationUIElement;
}

export const InsertRowsFromVariableEditor = ({ element, googleSheetHeaders }: Props) => {
    const [selectedVariableId, setSelectedVariableId] = useState<BotVariable["id"]>(element.dataOperationDescription?.variableId ?? '');

    const handleVariableChange = useCallback((variable?: BotVariable) => {
        throwIfNil(variable);

        setSelectedVariableId(variable.id);
        element.dataOperationDescription = { variableId: variable.id };
    }, [element]);


    const handleVariableFilter = useCallback((variable: BotVariable) => {
        if (variable.type === VariableType.ARRAY && variable.arrayItemType === VariableType.OBJECT) {
            try {
                const arrayValue = JSON.parse(variable.value as string);

                if (arrayValue instanceof Array && arrayValue.length > 0) {
                    const firstObject = arrayValue[0];
                    const keys = Object.keys(firstObject);
                    return googleSheetHeaders.some(header => keys.includes(header));
                }
            }
            catch {

            }
        }

        if (variable.type === VariableType.OBJECT) {
            const value = JSON.parse(variable.value as string);
            return googleSheetHeaders.some(header => Object.keys(value).includes(header));
        }

        return false;
    }, [googleSheetHeaders]);

    return (
        <Box>
            <Alert sx={{ mb: 2 }} severity="warning">You need to select an Array variable containing objects, or an object variable, where the property names match the column headers from the Google Spreadsheet.</Alert>
            <VariableSelector
                newVariableTemplate={{ type: VariableType.OBJECT, value: getExportObjectNewVariableTemplate(googleSheetHeaders) }}
                valueId={selectedVariableId} onVariableChange={handleVariableChange} onCustomVariableFilter={handleVariableFilter} />
        </Box>
    )
}
