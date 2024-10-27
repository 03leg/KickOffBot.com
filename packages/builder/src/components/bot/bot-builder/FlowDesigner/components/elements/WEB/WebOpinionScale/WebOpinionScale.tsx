import { OpinionScaleShowLabelsMode, WebOpinionScaleUIElement } from '@kickoffbot.com/types';
import { Alert, Box } from '@mui/material';
import React, { useMemo } from 'react';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { useVariableInTextStyles } from '../../ChangeVariable/useContentWithVariable';
import { isNil } from 'lodash';

interface Props {
    element: WebOpinionScaleUIElement;
}

export const WebOpinionScale = ({ element }: Props) => {
    const { classes } = useVariableInTextStyles();
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    const answerVariable = useMemo(() => {
        if (!element.variableId) {
            return null;
        }
        return getVariableById(element.variableId);
    }, [element.variableId, getVariableById]);

    return (
        <Box>
            Min value: {element.min} {element.showLabels && element.showLabelsMode === OpinionScaleShowLabelsMode.MaxAndMin && element.minLabel && <>({element.minLabel})</>}<br />
            Max value: {element.max} {element.showLabels && element.showLabelsMode === OpinionScaleShowLabelsMode.MaxAndMin && element.maxLabel && <>({element.maxLabel})</>}<br />
            
            {element.showLabels && element.showLabelsMode === OpinionScaleShowLabelsMode.EachOption && <>Each option has a label.<br /></>}

            {!isNil(element.defaultAnswer) && <>Default value: {element.defaultAnswer} <br /></>}

            <Box sx={{ marginTop: 1 }}>
                {answerVariable?.name && <>save user input to <span className={classes.variable}>{answerVariable.name}</span></>}
                {!answerVariable?.name && <>
                    <Alert sx={{ mb: 2 }} severity="error">Please set a variable to store the user input.</Alert>
                </>}
            </Box>

            <Box sx={{ marginTop: 1 }}>
                {element.min >= element.max && <Alert sx={{ mb: 2 }} severity="error">Min value must be smaller than max value.</Alert>}
                {element.max - 10 >= element.min && <Alert sx={{ mb: 2 }} severity="error">There can be no more than 10 elements between the minimum and maximum values.</Alert>}
                {(!isNil(element.defaultAnswer) && (element.defaultAnswer < element.min || element.defaultAnswer > element.max)) && <Alert sx={{ mb: 2 }} severity="error">Default answer must be between the minimum and maximum values.</Alert>}
            </Box>
        </Box>
    )
}
