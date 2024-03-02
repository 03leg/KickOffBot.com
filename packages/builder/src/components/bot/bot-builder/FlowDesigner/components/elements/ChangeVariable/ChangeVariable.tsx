import { ChangeBooleanVariableWorkflow, ChangeBooleanVariableWorkflowStrategy, ChangeNumberStringVariableWorkflow, ChangeObjectVariableDataSource, ChangeObjectVariableWorkflow, ChangeVariableUIElement, UIElement, VariableType } from '@kickoffbot.com/types';
import React, { useMemo } from 'react'
import { useContentWithVariable, useVariableInTextStyles } from './useContentWithVariable';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { makeStyles } from 'tss-react/mui';

interface Props {
    element: UIElement;
}

export const useStyles = makeStyles()(() => ({
    numberExpression: {
        display: 'inline-block'
    }
}));

export const ChangeVariable = ({ element }: Props) => {
    const uiElement = element as ChangeVariableUIElement;
    const { classes } = useVariableInTextStyles();
    const { classes: componentClasses } = useStyles();

    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    const variable = useMemo(() => {
        if (!uiElement.selectedVariableId) {
            return null;
        }
        return getVariableById(uiElement.selectedVariableId);
    }, [getVariableById, uiElement.selectedVariableId]);

    const text = useMemo(() => {

        switch (variable?.type) {
            case VariableType.STRING:
            case VariableType.NUMBER: {
                const wd = uiElement.workflowDescription as ChangeNumberStringVariableWorkflow;
                const expression = wd.expression;

                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return expression;
            }
            case VariableType.BOOLEAN: {
                const wd = uiElement.workflowDescription as ChangeBooleanVariableWorkflow;

                switch (wd.strategy) {
                    case ChangeBooleanVariableWorkflowStrategy.SET_FALSE: {
                        return 'False';
                    }
                    case ChangeBooleanVariableWorkflowStrategy.SET_TRUE: {
                        return 'True';
                    }
                    case ChangeBooleanVariableWorkflowStrategy.TOGGLE: {
                        return 'Toggle current value';
                    }
                    default:
                        {
                            throw new Error('NotImplementedError');
                        }
                }
            }
            case VariableType.OBJECT: {
                const item = uiElement.workflowDescription as ChangeObjectVariableWorkflow;

                switch (item.source) {
                    case ChangeObjectVariableDataSource.JSON: {
                        return '(from JSON)';
                    }
                    case ChangeObjectVariableDataSource.VARIABLE: {
                        return '(from variable)';
                    }
                }
            }

        }

        return 'Change variable...';


    }, [uiElement.workflowDescription, variable])

    const content = useContentWithVariable(text ?? '');

    return (
        <div>
            {variable && <><span className={classes.variable}>{variable?.name}</span> = <div className={componentClasses.numberExpression} dangerouslySetInnerHTML={{ __html: content }}></div></>}
            {!variable && text}
        </div>
    )
}
