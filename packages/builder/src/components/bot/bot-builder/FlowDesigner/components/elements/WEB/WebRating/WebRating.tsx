import { WebRatingUIElement } from '@kickoffbot.com/types';
import { Box, Alert } from '@mui/material';
import { isNil } from 'lodash';
import React, { useMemo } from 'react';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { useVariableInTextStyles } from '../../ChangeVariable/useContentWithVariable';

interface Props {
    element: WebRatingUIElement
}

export const WebRating = ({ element }: Props) => {
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
        <div>
            Count of options: {element.elementCount} <br />
            {element.showLabels && <>Each option has a label.<br /></>}

            {!isNil(element.defaultAnswer) && <>Default value: {element.defaultAnswer} <br /></>}

            <Box sx={{ marginTop: 1 }}>
                {answerVariable?.name && <>save user input to <span className={classes.variable}>{answerVariable.name}</span></>}
                {!answerVariable?.name && <>
                    <Alert sx={{ mb: 2 }} severity="error">Please set a variable to store the user input.</Alert>
                </>}
            </Box>
        </div>
    )
}
