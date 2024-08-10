import { BotVariable, VariableConverter } from '@kickoffbot.com/types'
import { Box, Button, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useCallback, useMemo } from 'react'
import AppDialog from '~/components/commons/Dialog/AppDialog';
import { PropertySelector } from '../VariableValueSource/condition/PropertySelector';
import { isPlainObject } from 'lodash';

export interface Props {
    variable: BotVariable;
    onClose: (result?: ConvertArrayOptionsDialogResult) => void;
}

export interface ConvertArrayOptionsDialogResult {
    converter: VariableConverter;
    propertyName: string | undefined;
}

export const ConvertArrayOptionsDialog = ({ variable, onClose }: Props) => {
    const [converter, setConverter] = React.useState<VariableConverter>(VariableConverter.COUNT);
    const [selectedPropertyName, setSelectedPropertyName] = React.useState<string | undefined>(undefined);

    const handleConverterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setConverter(e.target.value as VariableConverter);
    }, []);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleInsert = useCallback(() => {
        onClose({
            converter,
            propertyName: converter === VariableConverter.COUNT ? undefined : selectedPropertyName
        })
    }, [converter, onClose, selectedPropertyName]);

    const availableProperties = useMemo(() => {
        const value = JSON.parse(variable.value as string);

        if (value instanceof Array && isPlainObject(value[0])) {
            return Object.keys(value[0]).filter(key => typeof value[0][key] === "number");
        }

        return [];
    }, [variable.value]);

    const handlePropertyNameChange = useCallback((propertyName: string) => {
        setSelectedPropertyName(propertyName);
    }, []);

    const insertButtonDisabled = useMemo(() => {
        return (converter !== VariableConverter.COUNT && selectedPropertyName === undefined && availableProperties.length !== 0);
    }, [availableProperties.length, converter, selectedPropertyName]);

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
                <Typography>Choose the operation you want to perform to convert the array into a single number.</Typography>
                <RadioGroup sx={{ flex: 1 }} value={converter} onChange={handleConverterChange}>
                    <FormControlLabel value={VariableConverter.COUNT} control={<Radio />} label="Count Items" />
                    {availableProperties.length > 0 && <>
                        <FormControlLabel value={VariableConverter.SUM} control={<Radio />} label="Calculate Sum" />
                        <FormControlLabel value={VariableConverter.AVG} control={<Radio />} label="Calculate Average" />
                        <FormControlLabel value={VariableConverter.MAX} control={<Radio />} label="Find Maximum Value" />
                        <FormControlLabel value={VariableConverter.MIN} control={<Radio />} label="Find Minimum Value" />
                    </>}
                </RadioGroup>

                {availableProperties.length > 0 && converter !== VariableConverter.COUNT && <Box sx={{ marginTop: 2 }}>
                    <Typography sx={{ mb: 2 }}>Choose the property of the array object you want to perform the selected operation on.</Typography>
                    <PropertySelector propsDataSource={availableProperties} selectedPropertyName={selectedPropertyName} onPropertyNameChange={handlePropertyNameChange} arrayObject={{}} />
                </Box>}
            </Box>
        </AppDialog >
    )
}
