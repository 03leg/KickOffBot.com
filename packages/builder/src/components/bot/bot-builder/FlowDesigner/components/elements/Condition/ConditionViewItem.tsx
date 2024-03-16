import { ConditionItem, LogicalOperator } from '@kickoffbot.com/types';
import React, { useMemo } from 'react'
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { useVariableInTextStyles } from '../ChangeVariable/useContentWithVariable';
import { getConditionOperatorLabelByType } from './utils';
import { isNil } from 'lodash';
import { makeStyles } from 'tss-react/mui';

interface Props {
    item: ConditionItem;
    showLogicalOperatorSelector: boolean;
    nextItemLogicalOperator: LogicalOperator;
}

export const useStyles = makeStyles()(() => ({
    logicalOperator: {
        fontWeight: 'bold'
    },
}));

export const ConditionViewItem = ({ item, showLogicalOperatorSelector, nextItemLogicalOperator }: Props) => {
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));
    const { classes: variableClasses } = useVariableInTextStyles();
    const { classes } = useStyles();
    const value = useMemo(() => {

        if (typeof item.value === 'string') {
            return `"${item.value}"`
        }

        return item.value;
    }, [item.value]);


    const variable = useMemo(() => {
        if (!item.variableId) {
            return null;
        }
        return getVariableById(item.variableId);
    }, [getVariableById, item.variableId]);

    const variableValue = useMemo(() => {
        if (!item.variableIdValue) {
            return null;
        }
        return getVariableById(item.variableIdValue);
    }, [getVariableById, item.variableIdValue]);

    if (isNil(variable) || isNil(item.operator)) {
        return null;
    }


    return (
        <span>WHEN <span className={variableClasses.variable}>{variable?.name}</span>
        {item.path && <span> (property <span className={variableClasses.propertyName}>{item.path}</span>) </span>}
         {' '}{getConditionOperatorLabelByType(item.operator)}
            {isNil(item.variableIdValue) && <span dangerouslySetInnerHTML={{ __html: ` ${value} ` }}></span>}
            {!isNil(item.variableIdValue) && <> value of <span className={variableClasses.variable}>{variableValue?.name}</span></>}

            <span className={classes.logicalOperator}>{showLogicalOperatorSelector ?  ` ${nextItemLogicalOperator} ` : ' '}</span>
        </span>
    )
}
