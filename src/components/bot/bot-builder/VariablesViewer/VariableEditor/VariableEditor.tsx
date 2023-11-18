import React, { useCallback, useState } from 'react';
import { VariableType, type BotVariable } from '../../types';
import { Box, FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent, TextField, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

interface Props {
    variable: BotVariable;
    onVariableChange: (variable: BotVariable) => void;
}

export const VariableEditor = ({ variable, onVariableChange }: Props) => {

    const [name, setName] = useState<string>(variable.name);
    const [type, setType] = useState<string>(variable.type);
    const [value, setValue] = useState<string | number | boolean>(variable.value as never);

    const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
        variable.name = event.target.value;
        onVariableChange(variable);
    }, [onVariableChange, variable]);

    const setVariableValue = useCallback((newValue: number | string | boolean) => {
        setValue(newValue);
        variable.value = newValue;
    }, [setValue, variable])

    const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('newValue', event.target.value);
        setVariableValue(event.target.value);
        onVariableChange(variable);
    }, [onVariableChange, setVariableValue, variable]);

    const handleTypeChange = useCallback((event: SelectChangeEvent<string>) => {
        setType(event.target.value);
        variable.type = event.target.value as VariableType;


        switch (variable.type) {
            case VariableType.STRING: {
                setVariableValue('')
                break;
            }
            case VariableType.NUMBER: {
                setVariableValue(0)
                break;
            }
            case VariableType.BOOLEAN: {
                setVariableValue(true)
                break;
            }
            case VariableType.OBJECT: {
                setVariableValue('{\n "productId": 1,\n "productName": "Product #123",\n "price": 123\n}')
                break;
            }
            case VariableType.ARRAY: {
                setVariableValue('[\n{\n "productId": 1,\n "productName": "Product #123",\n "price": 123\n},\n{\n "productId": 2,\n "productName": "Product #321",\n "price": 321\n}\n]')
                break;
            }
        }

        onVariableChange(variable);

    }, [onVariableChange, setVariableValue, variable]);


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

            {(type === VariableType.STRING.toString() || type === VariableType.OBJECT.toString() || type === VariableType.ARRAY.toString()) &&
                (<TextField
                    sx={{ marginTop: 2 }}
                    id="string-value"
                    label="Value"
                    multiline
                    fullWidth
                    rows={8}
                    value={value}
                    onChange={handleValueChange}
                />)}

            {type === VariableType.NUMBER.toString() &&
                (<TextField
                    type="number"
                    sx={{ marginTop: 2 }}
                    label="Default value"
                    value={value}
                    onChange={handleValueChange}
                />)}

            {type === VariableType.BOOLEAN.toString() &&
                (<FormControl sx={{ marginTop: 2 }}>
                    <FormLabel id="default-value-boolean-editor">Default value</FormLabel>

                    <RadioGroup value={value} onChange={handleValueChange}>
                        <FormControlLabel value={true} control={<Radio />} label="True" />
                        <FormControlLabel value={false} control={<Radio />} label="False" />
                    </RadioGroup>
                </FormControl>)}
        </Box>
    )
}
