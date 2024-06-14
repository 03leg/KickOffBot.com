import { Box, Checkbox, FormControlLabel } from '@mui/material';
import React, { useCallback } from 'react'
import { VariableSelector } from '../../../VariableSelector';
import { BotVariable } from '@kickoffbot.com/types';
interface Props {
    saveResponseData: boolean;
    onSaveResponseDataChange: (value: boolean) => void;
    responseDataVariableId: string | undefined;
    onResponseDataVariableChange: (value: string | undefined) => void;

}

export const SaveResponseDataEditor = ({ saveResponseData, onSaveResponseDataChange, responseDataVariableId, onResponseDataVariableChange }: Props) => {
    const handleSaveResponseDataChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onSaveResponseDataChange(event.target.checked);
    }, [onSaveResponseDataChange]);

    const handleVariableChange = useCallback((newVariable: BotVariable) => {
        onResponseDataVariableChange(newVariable.id);
    }, [onResponseDataVariableChange]);

    return (
        <Box>
            <FormControlLabel sx={{ mb: 1 }} control={<Checkbox checked={saveResponseData} onChange={handleSaveResponseDataChange} />} label="Save response data to variable" />
            {saveResponseData && <VariableSelector valueId={responseDataVariableId} onVariableChange={handleVariableChange} />}
        </Box>
    )
}
