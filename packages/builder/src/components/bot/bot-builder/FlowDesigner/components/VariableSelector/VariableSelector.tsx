import { FormControl, MenuItem, Select, Typography, type SelectChangeEvent, InputLabel, Box, IconButton } from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { type VariableType, type BotVariable } from '@kickoffbot.com/types';
import { useFlowDesignerStore } from '../../../store';
import { isNil } from 'lodash';
import HistoryIcon from '@mui/icons-material/History';

interface Props {
    valueId?: string;
    variableTypes?: VariableType[];
    onVariableChange: (variable?: BotVariable) => void;
    onCustomVariableFilter?: (variable: BotVariable) => boolean;
    label?: string;
    showResetButton?: boolean;
}

export const VariableSelector = ({ valueId, variableTypes, onVariableChange, onCustomVariableFilter, label = 'Variable', showResetButton = false }: Props) => {
    const { variables } = useFlowDesignerStore((state) => ({
        variables: state.project.variables,
    }));


    const currentVariables = useMemo(() => {
        if (!isNil(onCustomVariableFilter)) {
            return variables.filter(v => onCustomVariableFilter(v))
        }

        if (isNil(variableTypes)) {
            return variables;
        }

        return variables.filter(v => variableTypes.includes(v.type));
    }, [onCustomVariableFilter, variableTypes, variables]);


    const handleVariableChange = useCallback((event: SelectChangeEvent<string>) => {
        const selectedVariable = variables.find(v => v.id === event.target.value);
        if (isNil(selectedVariable)) {
            throw new Error('InvalidOperationError');
        }

        onVariableChange(selectedVariable)
    }, [onVariableChange, variables]);


    return (
        <>
            {currentVariables.length === 0 &&
                <Typography textAlign={'center'}>
                    You project doesn&lsquo;t have variables yet.<br />
                </Typography>
            }
            {currentVariables.length > 0 &&
                <Box sx={{ display: 'flex' }}>
                    <FormControl fullWidth>
                        <InputLabel id="variable-selector-label">{label}</InputLabel>
                        <Select
                            labelId="variable-selector-label"
                            value={valueId ?? ''}
                            label={label}
                            onChange={handleVariableChange}
                        >
                            {currentVariables.map(v =>
                                (<MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>)
                            )}
                        </Select>
                    </FormControl>
                    {showResetButton && <IconButton disabled={isNil(valueId)} title='Reset' sx={{ ml: 1 }} onClick={() => onVariableChange(undefined)}><HistoryIcon /></IconButton>}
                </Box>}

        </>
    )
}
