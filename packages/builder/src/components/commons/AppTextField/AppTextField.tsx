import React from 'react'
import { useAppTextFieldStyles } from './AppTextField.style';
import { Box, TextField, TextFieldProps } from '@mui/material';
import { VariableSelectorDialog } from '~/components/bot/bot-builder/FlowDesigner/components/VariableSelectorDialog';
import { useInsertVariableToText } from '~/components/bot/bot-builder/FlowDesigner/components/elements/ChangeVariable/Editor/useInsertVariableToText';
import { isNil } from 'lodash';
import { StringItemsMenu } from '~/components/bot/bot-builder/FlowDesigner/components/elements/TextEditor/StringItemsMenu';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { BotVariable } from '@kickoffbot.com/types';


interface Props extends Pick<TextFieldProps, 'label'> {
    value: string;
    onValueChange: (value: string) => void;
    contextObjectProperties?: string[];
    showVariableSelector?: boolean;
    showTemplateSelector?: boolean;
    onVariableFilter?: (variable: BotVariable) => boolean;
    newVariableTemplate?: Partial<BotVariable>;
}

export const AppTextField = (props: Props) => {
    const { contextObjectProperties } = props;
    const { classes } = useAppTextFieldStyles();
    const { onVariableFilter } = props;

    const { handleInsertVariable, inputRef, updateSelectionStart, handleInsertContextPropertyInText, handleInsertTemplateInText } = useInsertVariableToText(props.value, (newValue) => {
        props.onValueChange(newValue);
    });

    const { templates } = useFlowDesignerStore((state) => ({
        templates: state.project.templates ?? []
    }));


    return (
        <Box className={classes.root}>
            <TextField fullWidth {...props} value={props.value} onChange={(e) => props.onValueChange(e.target.value)} inputRef={inputRef}
                onSelect={updateSelectionStart} />
            <Box className={classes.buttons}>
                {(props.showVariableSelector ?? true) && <VariableSelectorDialog newVariableTemplate={props.newVariableTemplate} onInsertVariable={handleInsertVariable} supportPathForObject={true} onCustomVariableFilter={onVariableFilter} />}
                {!isNil(contextObjectProperties) && <StringItemsMenu values={contextObjectProperties} onInsertItem={handleInsertContextPropertyInText} buttonIcon={<ControlPointIcon />} />}
                {props.showTemplateSelector && <StringItemsMenu values={templates.map(t => t.name)} onInsertItem={handleInsertTemplateInText} buttonIcon={<AssignmentIcon />} />}
            </Box>
        </Box>
    )
}
