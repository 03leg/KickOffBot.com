import { Box, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react'
import { VariableType, type BotVariable, type InputTextUIElement } from '@kickoffbot.com/types';
import { VariableSelector } from '../../../VariableSelector';
import { throwIfNil } from '~/utils/guard';

interface Props {
    element: InputTextUIElement;
}

export const TextInputEditor = ({ element }: Props) => {

    const [selectedVariableId, setSelectedVariableId] = useState<string>(element.variableId ?? '');

    const handleVariableChange = useCallback((newVariable?: BotVariable) => {
        throwIfNil(newVariable);
        
        setSelectedVariableId(newVariable.id);
        element.variableId = newVariable.id;
    }, [element]);

    return (
        <Box>
            <Typography>Select variable to save user input:</Typography>
            <Box sx={{ marginTop: 2 }}>
                <VariableSelector valueId={selectedVariableId} variableTypes={[VariableType.STRING, VariableType.NUMBER]} onVariableChange={handleVariableChange} />
            </Box>
        </Box>
    )
}
