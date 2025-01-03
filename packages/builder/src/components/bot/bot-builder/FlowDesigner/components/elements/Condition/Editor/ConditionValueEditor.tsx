import { Box, FormControlLabel, IconButton, Radio, RadioGroup, TextField } from '@mui/material'
import React, { useCallback, useMemo } from 'react';
import { VariableSelectorDialog } from '../../../VariableSelectorDialog';
import { BotVariable, VariableType } from '@kickoffbot.com/types';
import { isNil } from 'lodash';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { useVariableInTextStyles } from '../../ChangeVariable/useContentWithVariable';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    value: string | number | boolean | undefined;
    variableType: VariableType;
    onConditionValueChange: (newValue: string | number | boolean | undefined, isVariableId: boolean, path?: string) => void;
    variableIdValue: BotVariable['id'] | undefined;
    pathVariableIdValue?: string | undefined;
}

export const ConditionValueEditor = ({ value, onConditionValueChange, variableType, variableIdValue, pathVariableIdValue }: Props) => {
    const { classes: variableClasses } = useVariableInTextStyles();

    const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue: boolean | number | string | undefined = undefined;

        switch (variableType) {
            case VariableType.BOOLEAN: {
                newValue = event.target.value === 'true';
                break;
            }
            case VariableType.NUMBER: {
                newValue = Number(event.target.value);
                break;
            }
            case VariableType.DATE_TIME:
            case VariableType.STRING: {
                newValue = event.target.value;
                break;
            }
            default: {
                throw new Error('NotImplementedError');
            }
        }

        onConditionValueChange(newValue, false);
    }, [onConditionValueChange, variableType]);

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


    const availableTypesForVariable = useMemo(() => {
        const result = [variableType];

        if (variableType === VariableType.DATE_TIME) {
            result.push(VariableType.STRING);
        }

        return result;
    }, [variableType]);

    return (
        <Box sx={{ marginTop: 2, display: 'flex', alignItems: 'center' }}>
            {isNil(variableIdValue) &&
                <>
                    {(variableType === VariableType.STRING || variableType === VariableType.DATE_TIME) && <TextField label='Value' sx={{ marginRight: 1 }} fullWidth variant="outlined" value={value} onChange={handleValueChange} />}
                    {variableType === VariableType.NUMBER && <TextField label='Value' type="number" sx={{ marginRight: 1 }} fullWidth variant="outlined" value={value} onChange={handleValueChange} />}

                    {variableType === VariableType.BOOLEAN &&
                        <RadioGroup sx={{ flex: 1 }} value={value} onChange={handleValueChange}>
                            <FormControlLabel value={true} control={<Radio />} label="True" />
                            <FormControlLabel value={false} control={<Radio />} label="False" />
                        </RadioGroup>
                    }
                </>
            }
            {!isNil(variableIdValue) && <Box sx={{ flex: 1 }}>
                value of <span className={variableClasses.variable}>{variable?.name}</span>
                {pathVariableIdValue && <span> (property <span className={variableClasses.variable}>{pathVariableIdValue}</span>)</span>}
                <IconButton sx={{ marginLeft: 1 }} onClick={handleDeleteVariable}>
                    <DeleteIcon />
                </IconButton>
            </Box>}

            <VariableSelectorDialog onInsertVariable={handleInsertVariable} supportPathForObject={true} availableVariableTypes={availableTypesForVariable} />
        </Box >
    )
}
