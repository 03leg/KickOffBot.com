import { VariableButtonsSourceStrategyDescription } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React, { useMemo } from 'react'
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { useVariableInTextStyles } from '../ChangeVariable/useContentWithVariable';
import { isNil } from 'lodash';

interface Props {
    variableButtonSource?: VariableButtonsSourceStrategyDescription;
}

export const ButtonsFromVariableDescriptionView = ({ variableButtonSource }: Props) => {
    const { classes } = useVariableInTextStyles();
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));


    const variable = useMemo(() => {
        if (!variableButtonSource?.variableSource?.variableId) {
            return null;
        }
        return getVariableById(variableButtonSource?.variableSource?.variableId);
    }, [getVariableById, variableButtonSource?.variableSource?.variableId]);

    const answerVariable = useMemo(() => {
        if (!variableButtonSource?.answerVariableId) {
            return null;
        }
        return getVariableById(variableButtonSource?.answerVariableId);
    }, [getVariableById, variableButtonSource?.answerVariableId]);



    const buttonTemplateView = useMemo(() => {
        const content = variableButtonSource?.customTextTemplate ?? '';
        const matches = content.matchAll(/<%(.*?)%>/g);
        let buttonContent = content;

        for (const m of matches) {
            const value = m[1];
            buttonContent = isNil(value) ? buttonContent : buttonContent.replace(m[0], `<span class="${classes.propertyName}">${value}</span>`);
        }

        return buttonContent;
    }, [classes.propertyName, variableButtonSource?.customTextTemplate]);

    if (!variableButtonSource) {
        return <>Configure...</>;
    }

    return (
        <Box>
            buttons from variable <span className={classes.variable}>{variable?.name}</span>
            {variableButtonSource?.variableSource?.path && <> (property <span className={classes.propertyName}>{variableButtonSource?.variableSource?.path}</span>)</>}
            <Box sx={{ marginTop: 1, fontWeight: 'bold' }}>
                button content template:<br />
                <span dangerouslySetInnerHTML={{ __html: buttonTemplateView }}></span>
            </Box>
            <Box sx={{ marginTop: 1 }}>
                save user input to <span className={classes.variable}>{answerVariable?.name}</span>
            </Box>
        </Box>
    )
}
