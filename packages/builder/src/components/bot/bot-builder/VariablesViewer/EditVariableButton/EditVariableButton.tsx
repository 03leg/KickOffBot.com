import React, { useCallback, useState } from 'react'
import AppDialog from '~/components/commons/Dialog/AppDialog'
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton } from '@mui/material';
import { type BotVariable, NOW_DATE_TIME_VARIABLE_NAME, VariableType } from '@kickoffbot.com/types';
import { VariableEditor } from '../VariableEditor/VariableEditor';
import { isNil } from 'lodash';
import EditIcon from '@mui/icons-material/Edit';
import { useFlowDesignerStore } from '../../store';
import { v4 } from 'uuid';
import dayjs from 'dayjs';


interface Props {
    variable?: BotVariable;
}


export const EditVariableButton = ({ variable }: Props) => {
    const [open, setOpen] = useState(false);
    const [currentVariable, setCurrentVariable] = useState<BotVariable>();
    const [disabledConfirmationButton, setDisabledConfirmationButton] = useState(false);
    const { addVariable, variables, updateVariable } = useFlowDesignerStore((state) => ({
        variables: state.project.variables,
        addVariable: state.addVariable,
        updateVariable: state.updateVariable
    }));

    const getNewVariableName = useCallback(() => {
        let name = '';
        let index = 1;
        do {
            name = `variable${index}`;
            index++;

        } while (variables.some(v => v.name === name));

        return name;
    }, [variables]);

    const handleAddVariable = useCallback((event: React.MouseEvent<HTMLElement>) => {


        const newVariable: BotVariable = { id: v4(), name: getNewVariableName(), type: VariableType.STRING, value: 'default value', isPlatformVariable: false }
        setCurrentVariable(newVariable);
        setOpen(true);

        event.stopPropagation();
    }, [getNewVariableName]);

    const handleEditVariable = useCallback(() => {
        const copyVariable = { ...variable } as BotVariable;
        setCurrentVariable(copyVariable);
        setOpen(true);
    }, [variable]);

    const handleClose = useCallback((_?: unknown, reason?: string) => {
        if (reason && reason === "backdropClick")
            return;

        setOpen(false);
    }, []);

    const handleSave = useCallback(() => {

        if (isNil(currentVariable)) {
            throw new Error('InvalidOperationError');
        }

        if (isNil(variable)) {
            addVariable(currentVariable);
        } else {
            updateVariable(currentVariable);
        }


        handleClose();
    }, [addVariable, currentVariable, handleClose, updateVariable, variable]);

    const handleVariableChange = useCallback((variable: BotVariable) => {
        let disabled = false;

        if (variable.name.includes(' ')) {
            disabled = true;
        }

        if (variables.some(v => v.name === variable.name && v.id !== variable.id)) {
            disabled = true;
        }

        if (variable.type === VariableType.OBJECT || variable.type === VariableType.ARRAY) {

            try {
                const inputObject = JSON.parse(variable.value as string);
                if (variable.type === VariableType.OBJECT && inputObject.constructor !== ({}).constructor) {
                    disabled = true;
                }
                if (variable.type === VariableType.ARRAY && inputObject.constructor !== [].constructor) {
                    disabled = true;
                }
            }
            catch {
                disabled = true;
            }

        }

        if (variable.type === VariableType.DATE_TIME && variable.name !== NOW_DATE_TIME_VARIABLE_NAME) {
            if (!variable.dateTimeFormat) {
                disabled = true;
            } else if ((!isNil(variable.value) && variable.value !== "") && dayjs(variable.value as string, variable.dateTimeFormat, true).isValid() === false) {
                disabled = true;
            }
        }

        if (variable.type === VariableType.ARRAY && variable.arrayItemType === VariableType.DATE_TIME) {
            if (!variable.dateTimeFormat) {
                disabled = true;
            }
        }

        setDisabledConfirmationButton(disabled);
    }, [variables]);

    return (
        <>
            {isNil(variable) ? (
                <Button sx={{ margin: 1 }} variant="contained" size='small' aria-label="add" onClick={handleAddVariable} endIcon={<AddIcon />}>
                    Add new
                </Button>
            ) :
                (
                    <IconButton sx={{ padding: 0.5 }} edge="end" title='Edit variable' aria-label="edit" onClick={handleEditVariable}>
                        <EditIcon />
                    </IconButton>
                )
            }
            <AppDialog
                onClose={handleClose}
                maxWidth={'sm'}
                buttons={[
                    <Button key={'save'} onClick={handleSave} variant='contained' color='success' disabled={disabledConfirmationButton}>Save</Button>,
                    <Button key={'close'} onClick={handleClose}>Close</Button>
                ]}
                open={open} title={isNil(variable) ? 'Add new variable' : 'Edit variable'}>
                <VariableEditor
                    variable={currentVariable!}
                    onVariableChange={handleVariableChange}
                />
            </AppDialog >
        </>
    )
}
