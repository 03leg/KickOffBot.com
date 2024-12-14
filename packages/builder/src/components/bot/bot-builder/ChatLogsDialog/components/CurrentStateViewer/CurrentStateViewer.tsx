import React from 'react'
import { useCurrentStateViewerStyles } from './CurrentStateViewer.style';
import AppDialog from '~/components/commons/Dialog/AppDialog';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Editor } from '@monaco-editor/react';
import { BotVariable } from '@kickoffbot.com/types';

interface Props {
    state: Record<BotVariable["name"], string>;
    onClose: () => void;
}

export const CurrentStateViewer = ({ state, onClose }: Props) => {
    const { classes } = useCurrentStateViewerStyles();

    const [variable, setVariable] = React.useState<BotVariable["name"]>();
    const [currentValue, setCurrentValue] = React.useState<string | undefined>();

    const handleVariableChange = (event: SelectChangeEvent) => {
        setVariable(event.target.value);
        setCurrentValue(state[event.target.value]);
    }

    return (
        <AppDialog
            onClose={onClose}
            maxWidth={'md'}
            buttons={[
                <Button key={'close'} onClick={onClose}>Close</Button>
            ]}
            open={true} title={'Current State'}>
            <Box className={classes.root}>
                <FormControl fullWidth className={classes.selector}>
                    <InputLabel id="variable-select-label">Variable</InputLabel>
                    <Select
                        labelId="variable-select-label"
                        value={variable}
                        label="Variable"
                        onChange={handleVariableChange}
                    >
                        {Object.keys(state).map((key) => <MenuItem key={key} value={key}>{key}</MenuItem>)}
                    </Select>
                </FormControl>
                {currentValue && <Editor height="350px"
                    defaultLanguage="json"
                    value={currentValue}
                    options={{ minimap: { enabled: false }, readOnly: true }}
                />}
            </Box>
        </AppDialog>
    )
}
