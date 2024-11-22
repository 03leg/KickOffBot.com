import { ChangeArrayVariableWorkflow, ChangeBooleanVariableWorkflow, ChangeBooleanVariableWorkflowStrategy, ChangeDateTimeVariableOperation, ChangeDateTimeVariableWorkflow, ChangeNumberStringVariableWorkflow, ChangeObjectVariableDataSource, ChangeObjectVariableWorkflow, ChangeVariableUIElement, UIElement, VariableType } from '@kickoffbot.com/types';
import React, { useMemo } from 'react'
import { useContentWithVariable, useVariableInTextStyles } from './useContentWithVariable';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { makeStyles } from 'tss-react/mui';
import { isNil } from 'lodash';
import { ObjectVariableDescriptionView } from './ObjectVariableDescriptionView';
import { ArrayVariableDescriptionView } from './ArrayVariableDescriptionView';

interface Props {
    element: UIElement;
}

export const useStyles = makeStyles()(() => ({
    numberExpression: {
        display: 'inline-block'
    },
    initialValue: {
        fontWeight: 'bold',
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
            case VariableType.DATE_TIME: {
                const wd = uiElement.workflowDescription as ChangeDateTimeVariableWorkflow;
                switch (wd.operation) {
                    case ChangeDateTimeVariableOperation.ADD_DURATION: {
                        return `Current value + duration`;
                    }
                    case ChangeDateTimeVariableOperation.REMOVE_DURATION: {
                        return `Current value - duration`;
                    }
                    case ChangeDateTimeVariableOperation.SET_NEW_VALUE: {
                        return 'New value';
                    }
                    default:
                        {
                            throw new Error('NotImplementedError');
                        }
                }
            }
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
            // case VariableType.OBJECT: {
            //     const item = uiElement.workflowDescription as ChangeObjectVariableWorkflow;

            //     switch (item.source) {
            //         case ChangeObjectVariableDataSource.JSON: {
            //             return '(from JSON)';
            //         }
            //         case ChangeObjectVariableDataSource.VARIABLE: {
            //             return <FromVariableDescriptionView/>;
            //         }
            //     }
            // }

        }

        return 'Change variable...';


    }, [uiElement.workflowDescription, variable])

    const content = useContentWithVariable(text ?? '');

    return (
        <div>
            {isNil(variable) && <span>Configure...</span>}
            {variable && variable.type !== VariableType.OBJECT && variable.type !== VariableType.ARRAY && !uiElement.restoreInitialValue && <><span className={classes.variable}>{variable?.name}</span> = <div className={componentClasses.numberExpression} dangerouslySetInnerHTML={{ __html: content }}></div></>}
            {variable && uiElement.restoreInitialValue && <><span className={classes.variable}>{variable?.name}</span> = <span className={componentClasses.initialValue}>initial value</span></>}
            {!isNil(variable) && variable.type === VariableType.OBJECT && <ObjectVariableDescriptionView workflow={uiElement.workflowDescription as ChangeObjectVariableWorkflow} variable={variable} />}
            {!isNil(variable) && variable.type === VariableType.ARRAY && <ArrayVariableDescriptionView workflow={uiElement.workflowDescription as ChangeArrayVariableWorkflow} variable={variable} />}
        </div>
    )
}
