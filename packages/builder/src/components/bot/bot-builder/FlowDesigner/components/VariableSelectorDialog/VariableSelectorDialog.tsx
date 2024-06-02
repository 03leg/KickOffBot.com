import React, { useCallback, useMemo, useState } from 'react';
import AbcIcon from '@mui/icons-material/Abc';
import { Box, Button, IconButton, Typography } from '@mui/material';
import SmhDialog from '~/components/commons/Dialog/SmhDialog';
import { VariableSelector } from '../VariableSelector';
import { VariableType, type BotVariable } from '@kickoffbot.com/types';
import { isEmpty, isNil } from 'lodash';
import { PropertySelector } from '../elements/ChangeVariable/Editor/VariableValueSource/condition/PropertySelector';

interface Props {
    onInsertVariable: (variable: BotVariable, path?: string) => void;
    availableVariableTypes?: VariableType[];
    supportPathForObject: boolean;
    onCustomVariableFilter?: (variable: BotVariable) => boolean;
}

function getVariableTypeBasedOnJsonType(jsonType: string) {
    switch (jsonType) {
        case 'string':
            return VariableType.STRING;
        case 'number':
            return VariableType.NUMBER;
        case 'boolean':
            return VariableType.BOOLEAN;
        default:
            return undefined;
    }
}

export const VariableSelectorDialog = ({ onInsertVariable, availableVariableTypes, supportPathForObject = false, onCustomVariableFilter }: Props) => {
    const [open, setOpen] = useState(false);
    const [selectedVariableInsert, setSelectedVariableInsert] = useState<BotVariable | null>(null);
    const [path, setPath] = useState<string | undefined>();


    const handleOpenDialog = useCallback(() => {
        setOpen(true);
    }, []);
    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleInsert = useCallback(() => {
        if (isNil(selectedVariableInsert)) {
            throw new Error('InvalidOperationError');
        }

        onInsertVariable(selectedVariableInsert, path);
        handleClose();
        setSelectedVariableInsert(null);
        setPath(undefined);

    }, [handleClose, onInsertVariable, path, selectedVariableInsert]);

    const handleVariableChange = useCallback((selectedVariable: BotVariable) => {
        setSelectedVariableInsert(selectedVariable);
    }, []);

    const handlePathPropertyChange = useCallback((propertyName: string) => {
        setPath(propertyName);
    }, []);


    const availablePropsForPathValue = useMemo(() => {
        const result = [];
        try {
            const defaultValue = (isNil(selectedVariableInsert) || isEmpty(selectedVariableInsert.value)) ? null : JSON.parse(selectedVariableInsert.value as string);
            const dataObject = defaultValue as Record<string, unknown>;

            if (typeof dataObject === 'object' && !isNil(dataObject)) {
                for (const propName of Object.keys(dataObject)) {
                    const type = getVariableTypeBasedOnJsonType(typeof dataObject[propName]);

                    if (!isNil(dataObject[propName]) && !isNil(type) && ((availableVariableTypes ?? [type]).includes(type))) {
                        result.push(propName);
                    }
                }
            }
        }
        catch (e) {
            console.error(e);
        }
        return result;
    }, [availableVariableTypes, selectedVariableInsert]);

    const actualAvailableVariableTypes = useMemo(() => {
        if (isNil(availableVariableTypes)) {
            return undefined;
        }

        if (supportPathForObject) {
            return [...availableVariableTypes, VariableType.OBJECT];
        }

        return availableVariableTypes;
    }, [availableVariableTypes, supportPathForObject]);

    return (
        <>
            <IconButton aria-label="edit-variable" onClick={handleOpenDialog}>
                <AbcIcon />
            </IconButton>
            <SmhDialog
                onClose={handleClose}
                maxWidth={'sm'}
                buttons={[
                    <Button key={'insert'} onClick={handleInsert} variant='contained' color='success' disabled={selectedVariableInsert === null}>Insert</Button>,
                    <Button key={'close'} onClick={handleClose}>Close</Button>
                ]}
                open={open} title={'Insert variable'}>
                <Box sx={{ marginBottom: 2 }}>
                    <Typography sx={{ marginBottom: 2 }}> Please select variable to insert:</Typography>
                    <VariableSelector variableTypes={actualAvailableVariableTypes} valueId={selectedVariableInsert?.id ?? ''} onVariableChange={handleVariableChange} onCustomVariableFilter={onCustomVariableFilter} />
                    {supportPathForObject && selectedVariableInsert?.type === VariableType.OBJECT &&
                        <Box sx={{ marginTop: 2 }}>
                            <PropertySelector arrayObject={{}}
                                selectedPropertyName={path}
                                onPropertyNameChange={handlePathPropertyChange}
                                propsDataSource={availablePropsForPathValue}
                            />
                        </Box>}
                </Box>
            </SmhDialog >
        </>
    )
}
