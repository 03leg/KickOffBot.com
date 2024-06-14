import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useInsertVariableToText } from '../../ChangeVariable/Editor/useInsertVariableToText';
import { VariableSelectorDialog } from '../../../VariableSelectorDialog';

interface Props {
    useRequestBody: boolean;
    requestBody: string;
    useRequestBodyChange: (value: boolean) => void;
    requestBodyChange: (value: string) => void;
}

export const HttpBodyEditor = ({ useRequestBody, requestBody, useRequestBodyChange, requestBodyChange }: Props) => {
    const { handleInsertVariable, inputRef, updateSelectionStart } = useInsertVariableToText(requestBody, (value) => {
        requestBodyChange(value);
    });

    const handleRequestBodyChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRequestBodyChange(event.target.checked);
    }, [useRequestBodyChange]);

    const handleBodyChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        requestBodyChange(event.target.value);
    }, [requestBodyChange]);

    return (
        <Box sx={{ mt: 2 }}>
            <FormControlLabel control={<Checkbox checked={useRequestBody} onChange={handleRequestBodyChange} />} label="Set request body" />

            {useRequestBody && <Box sx={{ display: 'flex', alignItems: 'start', mt: 1 }}>
                <TextField
                    label="Request body"
                    multiline
                    rows={8}
                    value={requestBody}
                    onChange={handleBodyChange}
                    sx={{ width: '100%', mr: 1 }}
                    inputRef={inputRef}
                    onSelect={updateSelectionStart}

                />

                <VariableSelectorDialog onInsertVariable={handleInsertVariable} supportPathForObject={false} />
            </Box>
            }
        </Box>
    )
}
