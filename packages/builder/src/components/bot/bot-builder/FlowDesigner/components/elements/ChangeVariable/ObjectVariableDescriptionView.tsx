import { ArrayFilterType, BotVariable, ChangeObjectVariableDataSource, ChangeObjectVariableWorkflow, VariableType } from '@kickoffbot.com/types';
import React, { useMemo } from 'react'
import { useVariableInTextStyles } from './useContentWithVariable';
import { makeStyles } from 'tss-react/mui';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { getConditionOperatorLabelByType } from '../Condition/utils';

interface Props {
  workflow: ChangeObjectVariableWorkflow;
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


export const ObjectVariableDescriptionView = ({ workflow, variable }: Props) => {
  const { classes } = useVariableInTextStyles();
  const { classes: componentClasses } = useStyles();

  const { getVariableById } = useFlowDesignerStore((state) => ({
    getVariableById: state.getVariableById
  }));

  const sourceVariable = useMemo(() => {
    if (!workflow.variableSource?.variableId) {
      return null;
    }
    return getVariableById(workflow.variableSource?.variableId);
  }, [getVariableById, workflow.variableSource?.variableId]);

  // {sourceVariable?.type !== VariableType.ARRAY && <span>value from variable</span>}

  const objectPropertyIsArray = useMemo(() => {
    if (workflow.variableSource?.path && sourceVariable?.type === VariableType.OBJECT) {
      try {
        const value = JSON.parse(sourceVariable.value as string)[workflow.variableSource?.path];

        return value instanceof Array;
      }
      catch {

      }
    }

    return false;
  }, [sourceVariable?.type, sourceVariable?.value, workflow.variableSource?.path]);

  return (
    <div>
      <span className={classes.variable}>{variable?.name}</span><span> = </span>
      {workflow.source === ChangeObjectVariableDataSource.JSON && <span className={componentClasses.jsonValue}>(JSON value)</span>}
      {workflow.source === ChangeObjectVariableDataSource.VARIABLE && (sourceVariable?.type === VariableType.ARRAY || objectPropertyIsArray) &&
        <span>
          {<span>
            {workflow.variableSource?.arrayFilter?.mode === ArrayFilterType.FIRST || workflow.variableSource?.arrayFilter?.mode === ArrayFilterType.CONDITIONS ? 'first ' : null}
            {workflow.variableSource?.arrayFilter?.mode === ArrayFilterType.LAST ? 'last ' : null}
            {workflow.variableSource?.arrayFilter?.mode === ArrayFilterType.RANDOM_ITEM ? 'random ' : null}
            element from{' '}
          </span>}
          <span className={classes.variable}>{sourceVariable?.name}</span>
          {workflow.variableSource?.path && <span> (property <span className={classes.propertyName}>{workflow.variableSource?.path}</span>) </span>}
          {workflow.variableSource?.arrayFilter?.mode === ArrayFilterType.CONDITIONS ? <>
            <span> where </span>
            {workflow.variableSource?.arrayFilter?.conditions?.map((condition, index) => {
              return (
                <span key={condition.id}>
                  {condition.propertyName ? <><span> property </span><span className={classes.propertyName}>{condition.propertyName}</span></> : 'value'}
                  {condition.operator && <span> {getConditionOperatorLabelByType(condition.operator).toLowerCase()} </span>}
                  {condition.value && <span className={componentClasses.value}>{condition.value.toString()}</span>}
                  {condition.variableIdValue &&
                    <>
                      <span> value from </span>
                      <span className={classes.variable}>{getVariableById(condition.variableIdValue)?.name}</span>
                      {condition.pathVariableIdValue && <span> (property <span className={classes.propertyName}>{condition.pathVariableIdValue}</span>) </span>}
                    </>}
                  {(workflow.variableSource?.arrayFilter?.conditions?.length ?? 0) > 1 && index + 1 !== workflow.variableSource?.arrayFilter?.conditions?.length && <span> {workflow.variableSource?.arrayFilter?.logicalOperator.toLowerCase()} </span>}
                </span>

              )
            })}
          </> : null}
        </span>}
      {workflow.source === ChangeObjectVariableDataSource.VARIABLE && sourceVariable?.type === VariableType.OBJECT && !objectPropertyIsArray &&
        <>
          value from{' '}
          <span className={classes.variable}>{sourceVariable?.name}</span>
          {workflow.variableSource?.path && <span> (property <span className={classes.propertyName}>{workflow.variableSource?.path}</span>) </span>}
        </>}
    </div>
  )
}
