import React, { useCallback, useState } from 'react';
import { VariableType, type BotVariable } from '../../types';
import { Box, FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent, TextField } from '@mui/material';

interface Props {
    variable: BotVariable;
    onVariableChange: (variable: BotVariable) => void;
}

export const VariableEditor = ({ variable, onVariableChange }: Props) => {

    const [name, setName] = useState<string>(variable.name);
    const [type, setType] = useState<string>(variable.type);
    const [value, setValue] = useState<string>(variable.value as string);

    const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
        variable.name = event.target.value;
        onVariableChange(variable);
    }, [onVariableChange, variable]);

    const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        variable.value = event.target.value;
        onVariableChange(variable);
    }, [onVariableChange, variable]);

    const handleTypeChange = useCallback((event: SelectChangeEvent<string>) => {
        setType(event.target.value);
        variable.type = event.target.value as VariableType;
        onVariableChange(variable);
    }, [onVariableChange, variable]);


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: 1 }}>
            <TextField fullWidth label='Name' variant="outlined" value={name} onChange={handleNameChange} />
            <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel id="type-select-label">Type</InputLabel>
                <Select
                    labelId="type-select-label"
                    value={type}
                    label="Type"
                    onChange={handleTypeChange}
                >
                    <MenuItem value={VariableType.STRING.toString()}>string</MenuItem>
                    <MenuItem value={VariableType.NUMBER.toString()}>number</MenuItem>
                    <MenuItem value={VariableType.BOOLEAN.toString()}>boolean</MenuItem>
                    <MenuItem value={VariableType.OBJECT.toString()}>object</MenuItem>
                    <MenuItem value={VariableType.ARRAY.toString()}>array</MenuItem>
                </Select>
            </FormControl>

            <TextField
                sx={{ marginTop: 2 }}
                id="string-value"
                label="Value"
                multiline
                fullWidth
                rows={4}
                value={value}
                onChange={handleValueChange}
            />
        </Box>
    )
}
