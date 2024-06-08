import { BotVariable, VariableType } from '@kickoffbot.com/types';
import { Box, TextField, IconButton } from '@mui/material';
import { isNil } from 'lodash';
import React, { useCallback, useMemo } from 'react'
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { VariableSelectorDialog } from '../../../../VariableSelectorDialog';
import { useVariableInTextStyles } from '../../../ChangeVariable/useContentWithVariable';
import DeleteIcon from '@mui/icons-material/Delete';


interface Props {
    value: string | number | boolean | undefined;
    onConditionValueChange: (newValue: string | number | boolean | undefined, isVariableId: boolean, path?: string) => void;
    variableIdValue: BotVariable['id'] | undefined;
    pathVariableIdValue?: string | undefined;
}

export const RowsFilterConditionValueEditor = ({ value, onConditionValueChange, variableIdValue, pathVariableIdValue }: Props) => {
    const { classes: variableClasses } = useVariableInTextStyles();

    const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue: boolean | number | string | undefined = undefined;

        newValue = event.target.value;

        onConditionValueChange(newValue, false);
    }, [onConditionValueChange]);

    const handleInsertVariable = (variable: BotVariable, path?: string) => {
        onConditionValueChange(variable.id, true, path);
    };

    const handleDeleteVariable = () => {
        onConditionValueChange(undefined, true);
    };

    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    const variable = useMemo(() => {
        if (!variableIdValue) {
            return null;
        }
        return getVariableById(variableIdValue);
    }, [getVariableById, variableIdValue]);

    return (
        <Box sx={{ marginTop: 2, display: 'flex', alignItems: 'center' }}>
            {isNil(variableIdValue) &&
                <>
                    <TextField label='Value' sx={{ marginRight: 1 }} fullWidth variant="outlined" value={value} onChange={handleValueChange} />
                </>
            }
            {!isNil(variableIdValue) && <Box sx={{ flex: 1 }}>
                value of <span className={variableClasses.variable}>{variable?.name}</span>
                {pathVariableIdValue && <span> (property <span className={variableClasses.variable}>{pathVariableIdValue}</span>)</span>}
                <IconButton sx={{ marginLeft: 1 }} onClick={handleDeleteVariable}>
                    <DeleteIcon />
                </IconButton>
            </Box>}

            <VariableSelectorDialog onInsertVariable={handleInsertVariable} supportPathForObject={true} availableVariableTypes={[VariableType.BOOLEAN, VariableType.NUMBER, VariableType.STRING]} />
        </Box >
    )
}
