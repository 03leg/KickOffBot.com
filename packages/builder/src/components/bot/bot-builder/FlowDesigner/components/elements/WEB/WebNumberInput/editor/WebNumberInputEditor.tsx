import { BotVariable, VariableType, WebInputNumberUIElement } from '@kickoffbot.com/types';
import { Box, Typography, TextField } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { VariableSelector } from '../../../../VariableSelector';
import { useWebNumberInputStyles } from './WebNumberInputEditor.style';
import { throwIfNil } from '~/utils/guard';

interface Props {
    element: WebInputNumberUIElement;
}

export const WebNumberInputEditor = ({ element }: Props) => {
    const { classes } = useWebNumberInputStyles();
    const [selectedVariableId, setSelectedVariableId] = useState<string>(element.variableId ?? '');
    const [placeholder, setPlaceholder] = useState<string>(element.placeholder ?? '');

    const [maxValue, setMaxValue] = useState<number | undefined>(element.max);
    const [minValue, setMinValue] = useState<number | undefined>(element.min);
    const [stepValue, setStepValue] = useState<number | undefined>(element.step);

    const handleVariableChange = useCallback((newVariable?: BotVariable) => {
        throwIfNil(newVariable);
        
        setSelectedVariableId(newVariable.id);
        element.variableId = newVariable.id;
    }, [element]);

    const handlePlaceHolderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPlaceholder(event.target.value);
        element.placeholder = event.target.value;
    }, [element]);

    const handleMaxChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setMaxValue(event.target.value === '' ? undefined : Number(event.target.value));
        element.max = event.target.value === '' ? undefined : Number(event.target.value);
    }, [element]);

    const handleMinChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setMinValue(event.target.value === '' ? undefined : Number(event.target.value));
        element.min = event.target.value === '' ? undefined : Number(event.target.value);
    }, [element]);

    const handleStepChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setStepValue(event.target.value === '' ? undefined : Number(event.target.value));
        element.step = event.target.value === '' ? undefined : Number(event.target.value);
    }, [element]);

    return (
        <Box>
            <Typography>Max value:</Typography>
            <TextField className={classes.editor} fullWidth type="number" value={maxValue} onChange={handleMaxChange} />
            <Typography>Min value:</Typography>
            <TextField className={classes.editor} fullWidth type="number" value={minValue} onChange={handleMinChange} />
            <Typography>Step:</Typography>
            <TextField className={classes.editor} fullWidth type="number" value={stepValue} onChange={handleStepChange} />

            <Typography>Placeholder:</Typography>
            <TextField className={classes.editor} fullWidth variant="outlined" value={placeholder} onChange={handlePlaceHolderChange} />

            <Typography>Select variable to save user input:</Typography>
            <Box sx={{ marginTop: 1 }}>
                <VariableSelector valueId={selectedVariableId} variableTypes={[VariableType.NUMBER]} onVariableChange={handleVariableChange} />
            </Box>
        </Box>
    )
}
