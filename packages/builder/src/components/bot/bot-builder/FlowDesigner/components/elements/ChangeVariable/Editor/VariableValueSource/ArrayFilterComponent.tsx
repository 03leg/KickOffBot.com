import { ArrayFilter, ArrayFilterType, LogicalOperator, PropertyConditionItem } from '@kickoffbot.com/types'
import { Box, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { PropertyConditionsComponent } from './PropertyConditionsComponent';
import { isNil } from 'lodash';

interface Props {
    arrayFilter?: ArrayFilter;
    onArrayFilterChange: (arrayFilter: ArrayFilter) => void;
    arrayObject: unknown;
}

export const ArrayFilterComponent = ({ arrayFilter, onArrayFilterChange, arrayObject }: Props) => {
    const [arrayFilterValue, setArrayFilterValue] = useState<ArrayFilter>(arrayFilter ?? {} as ArrayFilter);

    const handleValueDataSourceChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value as ArrayFilterType;

        setArrayFilterValue({ ...arrayFilterValue, mode: newValue, logicalOperator: LogicalOperator.AND });
    }, [arrayFilterValue]);


    const handlePropertyConditionsChange = useCallback((conditions: PropertyConditionItem[]) => {
        setArrayFilterValue({ ...arrayFilterValue, conditions })
    }, [arrayFilterValue])

    useEffect(() => {
        onArrayFilterChange(arrayFilterValue)
    }, [arrayFilterValue, onArrayFilterChange]);

    useEffect(() => {
        if (isNil(arrayFilter)) {
            setArrayFilterValue({} as ArrayFilter);
            console.log('clearing array filter');
        }
    }, [arrayFilter])

    return (
        <Box sx={{ marginTop: 2 }}>
            <RadioGroup sx={{ flex: 1 }} value={arrayFilterValue.mode} onChange={handleValueDataSourceChange}>
                <FormControlLabel value={ArrayFilterType.FIRST} control={<Radio />} label="First item" />
                <FormControlLabel value={ArrayFilterType.LAST} control={<Radio />} label="Last item" />
                <FormControlLabel value={ArrayFilterType.RANDOM_ITEM} control={<Radio />} label="Random item" />
                {Boolean(arrayObject) && <FormControlLabel value={ArrayFilterType.CONDITIONS} control={<Radio />} label="First item matching conditions" />}
            </RadioGroup>

            {arrayFilterValue.mode === ArrayFilterType.CONDITIONS && Boolean(arrayObject) &&
                <PropertyConditionsComponent arrayObject={arrayObject} conditions={arrayFilterValue.conditions} logicalOperator={arrayFilterValue.logicalOperator}
                    onPropertyConditionsChange={handlePropertyConditionsChange}
                    onLogicalOperatorChange={(operator) => setArrayFilterValue({ ...arrayFilterValue, logicalOperator: operator })} />}
        </Box>
    )
}
