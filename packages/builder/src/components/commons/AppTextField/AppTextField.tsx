import React, { useState } from 'react'
import { useAppTextFieldStyles } from './AppTextField.style';
import { Box, TextField, TextFieldProps } from '@mui/material';
import { VariableSelectorDialog } from '~/components/bot/bot-builder/FlowDesigner/components/VariableSelectorDialog';
import { useInsertVariableToText } from '~/components/bot/bot-builder/FlowDesigner/components/elements/ChangeVariable/Editor/useInsertVariableToText';

interface Props extends Pick<TextFieldProps, 'label'> {
    value: string;
    onValueChange: (value: string) => void;
}

export const AppTextField = (props: Props) => {
    const { classes } = useAppTextFieldStyles();

    const { handleInsertVariable, inputRef, updateSelectionStart } = useInsertVariableToText(props.value, (newValue) => {
        props.onValueChange(newValue);
    });

    return (
        <Box className={classes.root}>
            <TextField fullWidth {...props} value={props.value} onChange={(e) => props.onValueChange(e.target.value)} inputRef={inputRef}
                onSelect={updateSelectionStart} />
            <Box className={classes.buttons}>
                <VariableSelectorDialog onInsertVariable={handleInsertVariable} supportPathForObject={false} />
            </Box>
        </Box>
    )
}
