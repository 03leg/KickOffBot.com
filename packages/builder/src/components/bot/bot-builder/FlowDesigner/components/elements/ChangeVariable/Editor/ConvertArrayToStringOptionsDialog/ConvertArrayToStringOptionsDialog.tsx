import { BotVariable, VariableConverter } from '@kickoffbot.com/types'
import { Box, Button, FormControlLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo } from 'react'
import AppDialog from '~/components/commons/Dialog/AppDialog';
import { PropertySelector } from '../VariableValueSource/condition/PropertySelector';
import { isPlainObject } from 'lodash';
import { ConvertArrayOptionsDialogResult } from '../ConvertArrayToNumberOptionsDialog';

export interface Props {
    variable: BotVariable;
    onClose: (result?: ConvertArrayOptionsDialogResult) => void;
}


export const ConvertArrayToStringOptionsDialog = ({ variable, onClose }: Props) => {
    const [converter, setConverter] = React.useState<VariableConverter>(VariableConverter.RANDOM);
    const [selectedPropertyName, setSelectedPropertyName] = React.useState<string | undefined>(undefined);
    const [separatorValue, setSeparatorValue] = React.useState<string>(', ');

    const handleConverterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setConverter(e.target.value as VariableConverter);
    }, []);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleInsert = useCallback(() => {
        onClose({
            converter,
            propertyName: selectedPropertyName,
            params: converter === VariableConverter.CONCAT ? [separatorValue] : undefined
        })
    }, [converter, onClose, selectedPropertyName, separatorValue]);

    const availableProperties = useMemo(() => {
        const value = JSON.parse(variable.value as string);

        if (value instanceof Array && isPlainObject(value[0])) {
            return Object.keys(value[0]).filter(key => typeof value[0][key] === "number" || typeof value[0][key] === "string");
        }

        return [];
    }, [variable.value]);

    const handlePropertyNameChange = useCallback((propertyName: string) => {
        setSelectedPropertyName(propertyName);
    }, []);

    const insertButtonDisabled = useMemo(() => {
        return (selectedPropertyName === undefined && availableProperties.length !== 0);
    }, [availableProperties.length, selectedPropertyName]);

    useEffect(() => {
        if (availableProperties.length === 0) {
            setSelectedPropertyName(undefined);
        }

    }, [availableProperties])

    return (
        <AppDialog
            onClose={handleClose}
            maxWidth={'sm'}
            buttons={[
                <Button key={'insert'} onClick={handleInsert} disabled={insertButtonDisabled} variant='contained' color='success'>Insert</Button>,
                <Button key={'close'} onClick={handleClose}>Close</Button>
            ]}
            open={true} title={'Select Operation for Array Conversion'}>
            <Box sx={{ marginBottom: 2 }}>
                <Typography>Choose the operation you want to perform to convert the array into a single string.</Typography>
                <RadioGroup sx={{ flex: 1 }} value={converter} onChange={handleConverterChange}>
                    <FormControlLabel value={VariableConverter.RANDOM} control={<Radio />} label="Select Random Value" />
                    <FormControlLabel value={VariableConverter.CONCAT} control={<Radio />} label="Concatenate values into a single string" />
                </RadioGroup>

                {converter === VariableConverter.CONCAT && <TextField sx={{ marginTop: 2 }} label="Separator" fullWidth variant="outlined" value={separatorValue} onChange={e => setSeparatorValue(e.target.value)} />}

                {availableProperties.length > 0 && <Box sx={{ marginTop: 2 }}>
                    <Typography sx={{ mb: 2 }}>Choose the property of the array object you want to perform the selected operation on.</Typography>
                    <PropertySelector propsDataSource={availableProperties} selectedPropertyName={selectedPropertyName} onPropertyNameChange={handlePropertyNameChange} arrayObject={{}} />
                </Box>}
            </Box>
        </AppDialog >
    )
}
