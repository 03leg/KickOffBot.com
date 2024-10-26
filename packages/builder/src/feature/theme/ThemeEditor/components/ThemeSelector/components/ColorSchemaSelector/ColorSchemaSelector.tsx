import { BackgroundColorSchema } from '@kickoffbot.com/types';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useCallback } from 'react'

interface Props {
    schema?: BackgroundColorSchema;
    onChange: (schema: BackgroundColorSchema) => void;
}

const label = "Color Schema" as const

export default function ColorSchemaSelector({ schema, onChange }: Props) {

    const handleSchemaChange = useCallback((event: SelectChangeEvent<BackgroundColorSchema>) => {
        onChange(event.target.value as BackgroundColorSchema);
    }, [onChange]);


    return (
        <FormControl fullWidth >
            <InputLabel>{label}</InputLabel>
            <Select
                value={schema ?? BackgroundColorSchema.OneColor}
                label={label}
                onChange={handleSchemaChange}
            >
                (<MenuItem key={BackgroundColorSchema.OneColor} value={BackgroundColorSchema.OneColor}>One color</MenuItem>)
                (<MenuItem key={BackgroundColorSchema.Schema1} value={BackgroundColorSchema.Schema1}>Schema #1</MenuItem>)
                (<MenuItem key={BackgroundColorSchema.Schema2} value={BackgroundColorSchema.Schema2}>Schema #2</MenuItem>)
                (<MenuItem key={BackgroundColorSchema.Schema3} value={BackgroundColorSchema.Schema3}>Schema #3</MenuItem>)
                (<MenuItem key={BackgroundColorSchema.Image} value={BackgroundColorSchema.Image}>Image</MenuItem>)
            </Select>
        </FormControl>
    )
}
