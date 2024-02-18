import { LogicalOperator } from '@kickoffbot.com/types';
import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useCallback, useMemo } from 'react';

interface Props {
    value?: LogicalOperator;
    onValueChange: (value: LogicalOperator) => void;
}

export const LogicalOperatorComponent = ({ value, onValueChange }: Props) => {
    const dataSource = useMemo(() => {
        const result = [];

        result.push({ id: LogicalOperator.AND, label: 'AND' });
        result.push({ id: LogicalOperator.OR, label: 'OR' });

        return result;
    }, []);
    const handleValueChange = useCallback((event: SelectChangeEvent<string>) => {
        const t = event.target.value;
        onValueChange(t as LogicalOperator);
    }, [onValueChange]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormControl sx={{ marginTop: 2 }}>
                <Select
                    value={value}
                    onChange={handleValueChange}
                >
                    {dataSource.map(v =>
                        (<MenuItem key={v.id} value={v.id}>{v.label}</MenuItem>)
                    )}
                </Select>
            </FormControl>
        </Box>
    )
}
