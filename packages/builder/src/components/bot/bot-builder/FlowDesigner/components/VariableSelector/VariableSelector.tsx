import { FormControl, MenuItem, Select, Typography, type SelectChangeEvent, InputLabel, Box, IconButton } from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { type VariableType, type BotVariable } from '@kickoffbot.com/types';
import { useFlowDesignerStore } from '../../../store';
import { isNil } from 'lodash';
import HistoryIcon from '@mui/icons-material/History';
import { EditVariableButton } from '../../../VariablesViewer/EditVariableButton';
import { getVariableIcon } from '~/utils/getVariableIcon';

interface Props {
    valueId?: string;
    variableTypes?: VariableType[];
    onVariableChange: (variable?: BotVariable) => void;
    onCustomVariableFilter?: (variable: BotVariable) => boolean;
    label?: string;
    showResetButton?: boolean;
    showEditVariableButton?: boolean;
    showNewVariableButton?: boolean;
    newVariableTemplate?: Partial<BotVariable>;
}

export const VariableSelector = ({ valueId, variableTypes, onVariableChange, onCustomVariableFilter,
    label = 'Variable', showResetButton = false, showEditVariableButton = true, showNewVariableButton = true, newVariableTemplate }: Props) => {
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

    const currentSelectedVariable = useMemo(() => {
        if (isNil(valueId)) {
            return undefined;
        }

        return variables.find(v => v.id === valueId);
    }, [valueId, variables]);

    const handleNewVariableCreate = useCallback((variable: BotVariable) => {
        if (!isNil(onCustomVariableFilter) && !onCustomVariableFilter(variable)) {
            return;
        }

        if (!isNil(variableTypes) && !variableTypes.includes(variable.type)) {
            return;
        }

        onVariableChange(variable);
    }, [onCustomVariableFilter, onVariableChange, variableTypes]);

    const getVariableMenuItem = useCallback((variable: BotVariable) => {
        const { icon, iconTitle } = getVariableIcon(variable);

        return <MenuItem key={variable.id} value={variable.id}>
            <Box sx={{ display: 'flex', alignItems: 'center', '& > svg': { mr: 1 } }} title={`${variable.name} [${iconTitle}]`} style={{ width: '100%' }}>
                {icon}
                {variable.name}
            </Box>
        </MenuItem>;
    }, []);

    return (
        <>
            {currentVariables.length === 0 &&
                <Typography textAlign={'center'}>
                    You project doesn&lsquo;t have variables yet.<br />
                    <EditVariableButton onNewVariableCreate={handleNewVariableCreate} newButtonView='button' newVariableTemplate={newVariableTemplate} />
                </Typography>
            }
            {currentVariables.length > 0 &&
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%'}}>
                    <FormControl fullWidth>
                        <InputLabel id="variable-selector-label">{label}</InputLabel>
                        <Select
                            labelId="variable-selector-label"
                            value={valueId ?? ''}
                            label={label}
                            onChange={handleVariableChange}
                        >
                            {currentVariables.map(v =>
                                getVariableMenuItem(v)
                            )}
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {showNewVariableButton && <EditVariableButton onNewVariableCreate={handleNewVariableCreate} newButtonView='icon' newIconButtonProps={{ sx: { ml: .5 }, title: 'New variable' }} newVariableTemplate={newVariableTemplate} />}
                        {showEditVariableButton && currentSelectedVariable && <EditVariableButton variable={currentSelectedVariable} editIconButtonProps={{ sx: { ml: .5 }, title: 'Edit variable' }} />}
                        {showResetButton && !isNil(valueId) && <IconButton title='Reset' sx={{ ml: 1 }} onClick={() => onVariableChange(undefined)}><HistoryIcon /></IconButton>}
                    </Box>
                </Box>}

        </>
    )
}
