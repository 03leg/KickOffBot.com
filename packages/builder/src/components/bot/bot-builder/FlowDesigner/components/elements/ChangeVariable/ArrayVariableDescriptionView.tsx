import { BotVariable, ChangeArrayOperation, ChangeArrayVariableWorkflow, RemoveItemFromArrayMode } from '@kickoffbot.com/types';
import React, { useMemo } from 'react'
import { useVariableInTextStyles } from './useContentWithVariable';
import { makeStyles } from 'tss-react/mui';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { getConditionOperatorLabelByType } from '../Condition/utils';

interface Props {
    workflow: ChangeArrayVariableWorkflow;
    variable: BotVariable;
}

export const useStyles = makeStyles()(() => ({
    jsonValue: {
        fontWeight: 'bold',
    },
    value: {
        fontWeight: 'bold',
    }
}));


export const ArrayVariableDescriptionView = ({ workflow, variable }: Props) => {
    const { classes } = useVariableInTextStyles();
    const { classes: componentClasses } = useStyles();

    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    //   const sourceVariable = useMemo(() => {
    //     if (!workflow.variableSource?.variableId) {
    //       return null;
    //     }
    //     return getVariableById(workflow.variableSource?.variableId);
    //   }, [getVariableById, workflow.variableSource?.variableId]);

    // {sourceVariable?.type !== VariableType.ARRAY && <span>value from variable</span>}

    //   const objectPropertyIsArray = useMemo(() => {
    //     if (workflow.variableSource?.path && sourceVariable?.type === VariableType.OBJECT) {
    //       try {
    //         const value = JSON.parse(sourceVariable.value as string)[workflow.variableSource?.path];

    //         return value instanceof Array;
    //       }
    //       catch {

    //       }
    //     }

    //     return false;
    //   }, [sourceVariable?.type, sourceVariable?.value, workflow.variableSource?.path]);

    const conditions = useMemo(() => {
        if (workflow.operation === ChangeArrayOperation.Remove) {
            return workflow.removeDescription?.conditions;
        }
        if (workflow.operation === ChangeArrayOperation.Add) {
            return workflow.addDescription?.variableSourceDescription?.extraFilter?.conditions;
        }
        if (workflow.operation === ChangeArrayOperation.Set) {
            return workflow.setDescription?.variableSourceDescription?.extraFilter?.conditions;
        }
    }, [workflow.addDescription?.variableSourceDescription?.extraFilter?.conditions, workflow.operation, workflow.removeDescription?.conditions, workflow.setDescription?.variableSourceDescription?.extraFilter?.conditions])

    const logicalOperator = useMemo(() => {
        if (workflow.operation === ChangeArrayOperation.Remove) {
            return workflow.removeDescription?.logicalOperator;
        }
        if (workflow.operation === ChangeArrayOperation.Add) {
            return workflow.addDescription?.variableSourceDescription?.extraFilter?.logicalOperator;
        }
        if (workflow.operation === ChangeArrayOperation.Set) {
            return workflow.setDescription?.variableSourceDescription?.extraFilter?.logicalOperator;
        }
    }, [workflow.addDescription?.variableSourceDescription?.extraFilter?.logicalOperator, workflow.operation, workflow.removeDescription?.logicalOperator, workflow.setDescription?.variableSourceDescription?.extraFilter?.logicalOperator])

    const sourceVariableDescription = useMemo(() => {

        let pathComponent: React.ReactElement | null = null;
        let variableId = null;
        let path = null;

        if (workflow.operation === ChangeArrayOperation.Add) {
            variableId = workflow.addDescription?.variableSourceDescription?.path.variableId;
            path = workflow.addDescription?.variableSourceDescription?.path.path;
        }
        if (workflow.operation === ChangeArrayOperation.Set) {
            variableId = workflow.setDescription?.variableSourceDescription?.path.variableId;
            path = workflow.setDescription?.variableSourceDescription?.path.path;
        }

        const sourceVariableLocal = getVariableById(variableId ?? '');

        if (sourceVariableLocal) {
            if (path) {
                pathComponent = <span> from property <span className={classes.propertyName}>{path}</span> of variable <span className={classes.variable}>{sourceVariableLocal.name}</span></span>
            }
            else {
                pathComponent = <span> from variable <span className={classes.variable}>{sourceVariableLocal.name}</span></span>
            }
        }


        return pathComponent;

    }, [classes.propertyName, classes.variable, getVariableById, workflow.addDescription?.variableSourceDescription?.path.path, workflow.addDescription?.variableSourceDescription?.path.variableId, workflow.operation, workflow.setDescription?.variableSourceDescription?.path.path, workflow.setDescription?.variableSourceDescription?.path.variableId]);

    return (
        <div>
            {workflow.operation === ChangeArrayOperation.Remove && <span>
                Remove
                {workflow.removeDescription?.mode === undefined || workflow.removeDescription?.mode === RemoveItemFromArrayMode.ALL && ' all items '}
                {workflow.removeDescription?.mode === RemoveItemFromArrayMode.FIRST && ' first item '}
                {workflow.removeDescription?.mode === RemoveItemFromArrayMode.LAST && ' last item '}
                {workflow.removeDescription?.mode === RemoveItemFromArrayMode.RANDOM && ' random item '}
                from <span className={classes.variable}>{variable?.name}</span>
            </span>}
            {workflow.operation === ChangeArrayOperation.Add && <span>
                Add items to <span className={classes.variable}>{variable?.name}</span>
                {sourceVariableDescription}
            </span>}
            {workflow.operation === ChangeArrayOperation.Set && <span>
                Set new items to <span className={classes.variable}>{variable?.name}</span>
                {sourceVariableDescription}
            </span>}
            {(conditions?.length ?? 0) > 0 ? <>
                <span> where </span>
                {conditions?.map((condition, index) => {
                    return (
                        <span key={condition.id}>
                            {condition.propertyName ? <><span>value of property </span><span className={classes.propertyName}>{condition.propertyName}</span></> : 'value'}
                            {condition.operator && <span> {getConditionOperatorLabelByType(condition.operator).toLowerCase()} </span>}
                            {condition.value && !condition.variableIdValue && <span className={componentClasses.value}>{condition.value.toString()}</span>}
                            {condition.variableIdValue &&
                                <>
                                    {!condition.pathVariableIdValue && <span> value from </span>}
                                    {condition.pathVariableIdValue && <span>value of property <span className={classes.propertyName}>{condition.pathVariableIdValue}</span> from </span>}
                                    <span className={classes.variable}>{getVariableById(condition.variableIdValue)?.name}</span>

                                </>}
                            {(conditions?.length ?? 0) > 1 && index + 1 !== conditions?.length && <span> {logicalOperator?.toLowerCase()} </span>}
                        </span>

                    )
                })}
            </> : null}
        </div>
    )
}
