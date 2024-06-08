import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useCallback } from 'react'

interface Props {
    propsDataSource?: string[];
    arrayObject?: object;
    selectedPropertyName?: string;
    onPropertyNameChange: (propertyName: string) => void;
    label?: string;
}

export const PropertySelector = ({ label = 'Property', arrayObject, selectedPropertyName = '', onPropertyNameChange, propsDataSource = arrayObject ? Object.keys(arrayObject) : [] }: Props) => {
    const handlePropertyChange = useCallback((event: SelectChangeEvent<string>) => {
        onPropertyNameChange(event.target.value);

    }, [onPropertyNameChange]);

    if (propsDataSource.length === 0) {
        return <>There are not properties to select</>
    }

    return (
        <FormControl fullWidth>
            <InputLabel id="property-selector-label">{label}</InputLabel>
            <Select
                labelId="property-selector-label"
                value={selectedPropertyName}
                label={label}
                onChange={handlePropertyChange}
            >
                {propsDataSource.map(p =>
                    (<MenuItem key={p} value={p}>{p}</MenuItem>)
                )}
            </Select>
        </FormControl>
    )
}
