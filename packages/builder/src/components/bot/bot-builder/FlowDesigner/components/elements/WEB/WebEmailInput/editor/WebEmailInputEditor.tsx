import { BotVariable, VariableType, WebInputEmailUIElement } from '@kickoffbot.com/types';
import { Box, TextField, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { VariableSelector } from '../../../../VariableSelector';
import { useWebEmailInputEditorStyles } from './WebEmailInputEditor.style';
import { throwIfNil } from '~/utils/guard';

interface Props {
    element: WebInputEmailUIElement;
}

export const WebEmailInputEditor = ({ element }: Props) => {
    const [selectedVariableId, setSelectedVariableId] = useState<string>(element.variableId ?? '');
    const { classes } = useWebEmailInputEditorStyles();
    const [placeholder, setPlaceholder] = useState<string>(element.placeholder ?? '');


    const handleVariableChange = useCallback((newVariable?: BotVariable) => {
        throwIfNil(newVariable);
        setSelectedVariableId(newVariable.id);
        element.variableId = newVariable.id;
    }, [element]);

    const handlePlaceHolderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPlaceholder(event.target.value);
        element.placeholder = event.target.value;
    }, [element]);

    return (
        <Box>
            <Typography>Placeholder:</Typography>
            <TextField sx={{ marginTop: 1, marginBottom: 3 }} fullWidth variant="outlined" value={placeholder} onChange={handlePlaceHolderChange} />

            <Typography className={classes.editorTitle}>Select variable to save user input:</Typography>
            <Box className={classes.variableSelector}>
                <VariableSelector 
                newVariableTemplate={{ type: VariableType.STRING, value: 'email' }}
                valueId={selectedVariableId} variableTypes={[VariableType.STRING]} onVariableChange={handleVariableChange} />
            </Box>
        </Box>
    )
}
