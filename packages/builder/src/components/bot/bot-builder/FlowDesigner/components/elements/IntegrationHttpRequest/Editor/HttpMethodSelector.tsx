import { HTTPMethod } from '@kickoffbot.com/types';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useCallback } from 'react';

interface Props {
    value: HTTPMethod;
    onHttpMethodChange: (httpMethod: HTTPMethod) => void;
}

export const HttpMethodSelector = ({ value, onHttpMethodChange }: Props) => {

    const handleHttpMethodChange = useCallback((event: SelectChangeEvent<HTTPMethod>) => {
        onHttpMethodChange(event.target.value as HTTPMethod);
    }, [onHttpMethodChange]);

    return (
        <FormControl sx={{ width: '150px'}}>
            <InputLabel id="type-select-label">HTTP Method</InputLabel>
            <Select
                labelId="type-select-label"
                value={value}
                label="HTTP Method"
                onChange={handleHttpMethodChange}
            >
                <MenuItem value={HTTPMethod.GET}>GET</MenuItem>
                <MenuItem value={HTTPMethod.POST}>POST</MenuItem>
                <MenuItem value={HTTPMethod.PUT}>PUT</MenuItem>
                <MenuItem value={HTTPMethod.PATCH}>PATCH</MenuItem>
                <MenuItem value={HTTPMethod.DELETE}>DELETE</MenuItem>
            </Select>
        </FormControl>
    )
}
