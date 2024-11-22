import { BotVariable, WebLogicBrowserCodeUIElement } from '@kickoffbot.com/types';
import React, { useCallback, useMemo, useState } from 'react';
import { useWebLogicBrowserCodeEditorStyles } from './WebLogicBrowserCodeEditor.style';
import { Alert, Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import { Editor } from '@monaco-editor/react';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';


interface Props {
    element: WebLogicBrowserCodeUIElement;
}

export const WebLogicBrowserCodeEditor = ({ element }: Props) => {
    const { classes } = useWebLogicBrowserCodeEditorStyles();
    const [code, setCode] = useState<string>(element.code);
    const { variables } = useFlowDesignerStore((state) => ({
        variables: state.project.variables
    }));
    const [requiredVariableIds, setRequiredVariableIds] = useState<string[]>(element.requiredVariableIds);
    const [modifiedVariableIds, setModifiedVariableIds] = useState<string[]>(element.modifiedVariableIds);

    const handleMonacoEditorChange = useCallback((value?: string) => {
        setCode(value ?? '');
        element.code = value ?? '';
    }, [element]);

    const requiredVariables = useMemo(() => {
        return variables.filter(variable => requiredVariableIds.includes(variable.id));

    }, [requiredVariableIds, variables]);

    const modifiedVariables = useMemo(() => {
        return variables.filter(variable => modifiedVariableIds.includes(variable.id));

    }, [modifiedVariableIds, variables]);

    return (
        <Box className={classes.root}>
            <Grid container spacing={2}>
                <Grid item sm={6} >
                    <Typography>Required data of following variables:</Typography>
                    <Autocomplete
                        className={classes.variables}
                        multiple
                        value={requiredVariables}
                        onChange={(event, newValue) => {
                            const newIds = newValue.map(variable => variable.id);
                            setRequiredVariableIds(newIds);
                            element.requiredVariableIds = newIds;
                        }}
                        options={variables}
                        getOptionLabel={(option: BotVariable) => option.name}
                        renderInput={(params) => (
                            <TextField {...params} label="Variables" placeholder="Variables" />
                        )}
                    />
                </Grid>
                <Grid item sm={6}>
                    <Typography>Script can change following variables:</Typography>
                    <Autocomplete
                        className={classes.variables}
                        multiple
                        value={modifiedVariables}
                        onChange={(event, newValue) => {
                            const newIds = newValue.map(variable => variable.id);
                            setModifiedVariableIds(newIds);
                            element.modifiedVariableIds = newIds;
                        }}
                        options={variables.filter(v => v.isPlatformVariable === false)}
                        getOptionLabel={(option: BotVariable) => option.name}
                        renderInput={(params) => (
                            <TextField {...params} label="Variables" placeholder="Variables" />
                        )}
                    />
                </Grid>
            </Grid>

            <Alert sx={{ mb: 3 }} severity="warning">
                Please keep in mind that the bot will transmit variable values to the client, and sending sensitive data may pose security risks.
                Also, keep in mind that unauthorized users can modify the values of your selected variables as they wish.
            </Alert>
            {/* </Box> */}
            <Editor height="350px"
                defaultLanguage="javascript"
                value={code}
                options={{ minimap: { enabled: false } }}
                onChange={handleMonacoEditorChange} />
        </Box>
    )
}
