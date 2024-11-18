import { ChangeObjectVariableDataSource } from '@kickoffbot.com/types';
import { Box, TextField } from '@mui/material';
import React, { useMemo } from 'react';
import { AppTextField } from '~/components/commons/AppTextField';

interface Props {
    operation: ChangeObjectVariableDataSource.INSERT_PROPERTY | ChangeObjectVariableDataSource.REMOVE_PROPERTY;
    propertyName?: string;
    propertyValue?: string;
    onPropertyChange: (propertyName: string) => void;
    onPropertyValueChange: (propertyValue: string) => void;
    targetVariableValue: object | null;

}

export const InsertOrRemoveObjectProperty = ({ operation, propertyName, propertyValue, onPropertyChange, onPropertyValueChange, targetVariableValue }: Props) => {

    const targetObjectProps = useMemo(() => {

        if (!targetVariableValue) {
            return [];
        }

        return Object.keys(targetVariableValue);

    }, [targetVariableValue]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>

            <AppTextField label="Property Name" showVariableSelector={false} value={propertyName ?? ''} onValueChange={onPropertyChange} contextObjectProperties={targetObjectProps} />
            {operation === ChangeObjectVariableDataSource.INSERT_PROPERTY &&
                <Box sx={{ mt: 2 }}>
                    <AppTextField label="Property Value" value={propertyValue ?? ''} onValueChange={onPropertyValueChange} showTemplateSelector={true}  />
                </Box>
            }
        </Box>
    )
}
