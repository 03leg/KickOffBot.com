import { FormControl, MenuItem, Select, Typography, type SelectChangeEvent } from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { type VariableType, type BotVariable } from '@kickoffbot.com/types';
import { useFlowDesignerStore } from '../../../store';
import { isNil } from 'lodash';

interface Props {
    valueId?: string;
    variableType?: VariableType;
    onVariableChange: (variable: BotVariable) => void;
}

export const VariableSelector = ({ valueId, variableType, onVariableChange }: Props) => {
    const { variables } = useFlowDesignerStore((state) => ({
        variables: state.project.variables,
    }));


    const currentVariables = useMemo(() => {
        if (isNil(variableType)) {
            return variables;
        }

        return variables.filter(v => v.type === variableType);
    }, [variableType, variables]);


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
                    You project doesn&lsquo;t have variables yet.<br/>
                    {!isNil(variableType) && `Variable type: ${variableType}.`}
                </Typography>
            }
            {currentVariables.length > 0 &&
                <FormControl fullWidth>
                    <Select
                        labelId="variable-selector-label"
                        value={valueId}
                        onChange={handleVariableChange}
                    >
                        {currentVariables.map(v =>
                            (<MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>)
                        )}
                    </Select>
                </FormControl>}
        </>
    )
}