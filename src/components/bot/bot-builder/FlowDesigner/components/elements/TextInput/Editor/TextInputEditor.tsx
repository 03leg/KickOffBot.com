import { Box, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react'
import { VariableType, type BotVariable, type InputTextUIElement } from '~/components/bot/bot-builder/types';
import { VariableSelector } from '../../../VariableSelector';

interface Props {
    element: InputTextUIElement;
}

export const TextInputEditor = ({ element }: Props) => {

    const [selectedVariableId, setSelectedVariableId] = useState<string>(element.variableId ?? '');

    const handleVariableChange = useCallback((newVariable: BotVariable) => {
        setSelectedVariableId(newVariable.id);
        element.variableId = newVariable.id;
    }, [element]);

    return (
        <Box>
            <Typography>Select variable to save user input:</Typography>
            <Box sx={{ marginTop: 2 }}>
                <VariableSelector valueId={selectedVariableId} variableType={VariableType.STRING} onVariableChange={handleVariableChange} />
            </Box>
        </Box>
    )
}
