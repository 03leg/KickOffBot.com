import { BotVariable, ValueReference } from '@kickoffbot.com/types';
import { Box, TextField, IconButton } from '@mui/material';
import { isNil } from 'lodash';
import React, { useMemo } from 'react';
import { useVariableInTextStyles } from '~/components/bot/bot-builder/FlowDesigner/components/elements/ChangeVariable/useContentWithVariable';
import { VariableSelectorDialog } from '~/components/bot/bot-builder/FlowDesigner/components/VariableSelectorDialog';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    onValueReferenceChange: (newValue?: ValueReference) => void;
    value?: ValueReference;
    onCustomVariableFilter?: (variable: BotVariable) => boolean;
    supportPathForObject?: boolean;
}

export const AppValueReference = ({ value, onValueReferenceChange, onCustomVariableFilter, supportPathForObject }: Props) => {
    const { classes: variableClasses } = useVariableInTextStyles();
    const handleInsertVariable = (variable: BotVariable, path?: string) => {
        onValueReferenceChange({ variableId: variable.id, path });
    };

    const handleDeleteVariable = () => {
        onValueReferenceChange(undefined);
    };

    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    const variable = useMemo(() => {
        if (!value?.variableId) {
            return null;
        }
        return getVariableById(value.variableId);
    }, [getVariableById, value?.variableId]);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isNil(value?.variableId) &&
                <>
                    <TextField placeholder='Value reference...' InputProps={{ readOnly: true, disableUnderline: true }} sx={{ marginRight: 1 }} fullWidth variant="outlined" />
                </>
            }
            {!isNil(value?.variableId) && <Box sx={{ flex: 1 }}>
                <IconButton onClick={handleDeleteVariable}>
                    <DeleteIcon />
                </IconButton>
                value of <span className={variableClasses.variable}>{variable?.name}</span>
                {value?.path && <span> (property <span className={variableClasses.variable}>{value.path}</span>)</span>}
            </Box>}

            <VariableSelectorDialog onInsertVariable={handleInsertVariable} supportPathForObject={supportPathForObject ?? false} onCustomVariableFilter={onCustomVariableFilter} />
        </Box >
    )
}
