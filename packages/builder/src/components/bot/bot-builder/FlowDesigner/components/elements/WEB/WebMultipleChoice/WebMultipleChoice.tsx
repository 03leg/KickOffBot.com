import { DataSourceType, WebMultipleChoiceUIElement } from '@kickoffbot.com/types';
import { Alert, Box } from '@mui/material';
import { isNil } from 'lodash';
import React, { useMemo } from 'react';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { useVariableInTextStyles } from '../../ChangeVariable/useContentWithVariable';
import { useWebMultipleChoiceStyles } from './WebMultipleChoice.style';

interface Props {
    element: WebMultipleChoiceUIElement;
}

export const WebMultipleChoice = ({ element }: Props) => {
    const { classes } = useWebMultipleChoiceStyles();
    const { classes: variableClasses } = useVariableInTextStyles();
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    const defaultOptionsVariable = useMemo(() => {
        if (!element.defaultOptionsVariableId) {
            return null;
        }

        return getVariableById(element.defaultOptionsVariableId);
    }, [element.defaultOptionsVariableId, getVariableById]);

    const answerVariable = useMemo(() => {
        if (!element.variableId) {
            return null;
        }
        return getVariableById(element.variableId);
    }, [element.variableId, getVariableById]);

    const optionsDataSourceVariable = useMemo(() => {
        if (!element.dataSourceVariableId) {
            return null;
        }
        return getVariableById(element.dataSourceVariableId);
    }, [element.dataSourceVariableId, getVariableById]);

    return (
        <Box>
            {element.dataSourceType === DataSourceType.Static && <>
                {element.optionsText && <><Box sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>with options <span className={classes.options}>{element.optionsText.split('\n').filter((option) => option !== '').join(', ')}</span></Box></>}
                {element.defaultOptions && isNil(element.defaultOptionsVariableId) && <Box sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>with initial selected options <span className={classes.options}>{element.defaultOptions.join(', ')}</span><br /></Box>}
                {!isNil(element.defaultOptionsVariableId) && <>with initial selected options from variable <span className={variableClasses.variable}>{defaultOptionsVariable?.name}</span><br /></>}
            </>}
            {element.dataSourceType === DataSourceType.Dynamic && <>
                options from variable <span className={variableClasses.variable}>{optionsDataSourceVariable?.name}</span><br/>
                {!isNil(element.defaultOptionsVariableId) && <>with initial selected options from variable <span className={variableClasses.variable}>{defaultOptionsVariable?.name}</span><br /></>}
            </>}

            {element.shuffleOptions && <>Shuffle options</>}

            <Box sx={{ marginTop: 1 }}>
                {answerVariable?.name && <>save user input to <span className={variableClasses.variable}>{answerVariable.name}</span></>}
                {!answerVariable?.name && <>
                    <Alert sx={{ mb: 2 }} severity="error">Please set a variable to store the user input.</Alert>
                </>}
            </Box>

        </Box>
    )
}
