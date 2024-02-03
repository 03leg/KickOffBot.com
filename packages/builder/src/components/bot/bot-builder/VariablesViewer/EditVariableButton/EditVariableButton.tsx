import React, { useCallback, useState } from 'react'
import SmhDialog from '~/components/commons/Dialog/SmhDialog'
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton } from '@mui/material';
import { type BotVariable, VariableType } from '@kickoffbot.com/types';
import { VariableEditor } from '../VariableEditor/VariableEditor';
import { isNil } from 'lodash';
import EditIcon from '@mui/icons-material/Edit';
import { useFlowDesignerStore } from '../../store';
import { v4 } from 'uuid';


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

    const handleAddVariable = useCallback(() => {
        const newVariable: BotVariable = { id: v4(), name: getNewVariableName(), type: VariableType.STRING, value: 'default value' }
        setCurrentVariable(newVariable);
        setOpen(true);
    }, [getNewVariableName]);

    const handleEditVariable = useCallback(() => {
        const copyVariable = { ...variable } as BotVariable;
        setCurrentVariable(copyVariable);
        setOpen(true);
    }, [variable]);

    const handleClose = useCallback(() => {
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

        setDisabledConfirmationButton(disabled);
    }, [variables]);

    return (
        <>
            {isNil(variable) ? (
                <IconButton sx={{ marginLeft: 2 }} size='small' aria-label="add" onClick={handleAddVariable}>
                    <AddIcon />
                </IconButton>
            ) :
                (
                    <IconButton edge="end" aria-label="edit" onClick={handleEditVariable}>
                        <EditIcon />
                    </IconButton>
                )
            }
            <SmhDialog
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
            </SmhDialog >
        </>
    )
}
