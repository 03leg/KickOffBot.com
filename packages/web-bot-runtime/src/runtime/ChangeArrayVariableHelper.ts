import {
  ChangeArrayVariableWorkflow,
  BotVariable,
  ChangeArrayOperation,
  LogicalOperator,
  RemoveItemFromArrayMode,
  AddValueToArrayFilterDescription,
  PropertyConditionItem,
  ConditionOperator,
  ValuePathDescription,
} from '@kickoffbot.com/types';
import { isEmpty, isNil, isPlainObject } from 'lodash';
import { throwIfNil } from 'src/utils/guard';
import { WebUserContext } from './WebUserContext';
import { WebBotRuntimeUtils } from './WebBotRuntimeUtils';
import { ConditionChecker } from './ConditionChecker';

export class ChangeArrayVariableHelper {
  public static getArrayValue(
    workflow: ChangeArrayVariableWorkflow,
    variable: BotVariable,
    userContext: WebUserContext,
    utils: WebBotRuntimeUtils,
  ) {
    const sourceVariableValue = userContext.getVariableValueByName(
      variable.name,
    ) as unknown[];

    if (!Array.isArray(sourceVariableValue)) {
      throw new Error(
        'InvalidOperationError: sourceVariableValue is not array',
      );
    }

    switch (workflow.operation) {
      case ChangeArrayOperation.Add: {
        throwIfNil(workflow.addDescription?.variableSourceDescription?.path);

        let values = this.getArrayValueByPath(
          workflow.addDescription.variableSourceDescription.path,
          userContext,
          utils,
        );

        values = this.applyFilter(
          userContext,
          utils,
          values,
          workflow.addDescription.variableSourceDescription.extraFilter,
        );

        return [...sourceVariableValue, ...values];
      }
      case ChangeArrayOperation.Set: {
        throwIfNil(workflow.setDescription?.variableSourceDescription?.path);

        let values = this.getArrayValueByPath(
          workflow.setDescription.variableSourceDescription.path,
          userContext,
          utils,
        );

        values = this.applyFilter(
          userContext,
          utils,
          values,
          workflow.setDescription.variableSourceDescription.extraFilter,
        );

        return [...values];
      }
      case ChangeArrayOperation.Remove: {
        throwIfNil(workflow.removeDescription);

        if (sourceVariableValue.length === 0) {
          return [];
        }

        const removedItems: unknown[] = [];

        for (const value of sourceVariableValue) {
          const checks: boolean[] = [];

          for (const condition of workflow.removeDescription?.conditions ??
            []) {
            checks.push(this.checkValue(userContext, utils, condition, value));
          }

          if (
            workflow.removeDescription.logicalOperator ===
              LogicalOperator.AND &&
            checks.every((p) => p)
          ) {
            removedItems.push(value);
          } else if (
            workflow.removeDescription.logicalOperator === LogicalOperator.OR &&
            checks.some((p) => p)
          ) {
            removedItems.push(value);
          }
        }

        switch (workflow.removeDescription.mode) {
          case RemoveItemFromArrayMode.FIRST: {
            return sourceVariableValue.filter(
              (item) => item !== (removedItems[0] ?? sourceVariableValue[0]),
            );
          }
          case RemoveItemFromArrayMode.LAST: {
            return sourceVariableValue.filter(
              (item) =>
                item !==
                (removedItems[removedItems.length - 1] ??
                  sourceVariableValue[sourceVariableValue.length - 1]),
            );
          }
          case RemoveItemFromArrayMode.RANDOM: {
            const randomElement =
              removedItems.length > 0
                ? removedItems[Math.floor(Math.random() * removedItems.length)]
                : sourceVariableValue[
                    Math.floor(Math.random() * sourceVariableValue.length)
                  ];
            return sourceVariableValue.filter((item) => item !== randomElement);
          }
          case undefined:
          case RemoveItemFromArrayMode.ALL: {
            if (removedItems.length > 0) {
              return sourceVariableValue.filter(
                (item) => !removedItems.includes(item),
              );
            }

            return [];
          }
        }

        throw new Error('NotImplementedError. Not supported operation.');
      }

      default: {
        throw new Error('NotImplementedError. Not supported operation.');
      }
    }
  }

  private static applyFilter(
    userContext: WebUserContext,
    utils: WebBotRuntimeUtils,
    values: unknown[],
    filter?: AddValueToArrayFilterDescription,
  ): unknown[] {
    if (isNil(filter)) {
      return values;
    }

    const result = this.checkConditions(
      userContext,
      utils,
      values,
      filter.conditions,
      filter.logicalOperator,
    );

    return result;
  }

  public static checkConditions(
    userContext: WebUserContext,
    utils: WebBotRuntimeUtils,
    values: unknown[],
    conditions?: PropertyConditionItem[],
    logicalOperator?: LogicalOperator,
  ): unknown[] {
    if (isNil(conditions) || conditions.length === 0 || values.length === 0) {
      return values;
    }

    const result: unknown[] = [];

    for (const value of values) {
      const checkArray: boolean[] = [];

      for (const condition of conditions) {
        const check = this.checkValue(userContext, utils, condition, value);
        checkArray.push(check);
      }

      if (checkArray.length === 0) {
        if (checkArray[0] === true) {
          result.push(value);
        }
      } else if (logicalOperator === LogicalOperator.AND) {
        if (checkArray.every((p) => p)) {
          result.push(value);
        }
      } else if (logicalOperator === LogicalOperator.OR) {
        if (checkArray.some((p) => p)) {
          result.push(value);
        }
      }
    }

    return result;
  }

  private static checkValue(
    userContext: WebUserContext,
    utils: WebBotRuntimeUtils,
    condition: PropertyConditionItem,
    value: unknown,
  ): boolean {
    throwIfNil(condition.operator);

    const conditionValue = this.getConditionValue(
      userContext,
      utils,
      condition,
    );
    let currentValue = value;

    if (
      !isNil(condition.propertyName) &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !isNil(value)
    ) {
      currentValue = (value as Record<string, unknown>)[condition.propertyName];
    }

    if (isNil(currentValue)) {
      const isConditionValueEqualNull = () => {
        if (isEmpty(conditionValue)) {
          return true;
        }

        return false;
      };

      switch (condition.operator) {
        case ConditionOperator.EQUAL_TO: {
          return isConditionValueEqualNull();
        }
        case ConditionOperator.NOT_EQUAL_TO: {
          return !isConditionValueEqualNull();
        }
      }

      return false;
    }

    switch (typeof currentValue) {
      case 'string': {
        return ConditionChecker.checkStringItem(
          currentValue,
          conditionValue as string,
          condition.operator,
        );
      }
      case 'number': {
        return ConditionChecker.checkNumberItem(
          currentValue,
          conditionValue as number,
          condition.operator,
        );
      }
      case 'boolean': {
        return ConditionChecker.checkBooleanItem(
          currentValue,
          conditionValue as boolean,
          condition.operator,
        );
      }
      default: {
        throw new Error('NotImplementedError for type: ' + typeof value);
      }
    }

    return false;
  }

  private static getConditionValue(
    userContext: WebUserContext,
    utils: WebBotRuntimeUtils,
    condition: PropertyConditionItem,
  ): unknown {
    let conditionValue: unknown;

    if (!isNil(condition.variableIdValue)) {
      const variable = utils.getVariableById(condition.variableIdValue);
      const variableValue = userContext.getVariableValueByName(variable.name);

      if (
        !isNil(condition.pathVariableIdValue) &&
        typeof variableValue === 'object' &&
        !Array.isArray(variableValue)
      ) {
        conditionValue = variableValue[condition.pathVariableIdValue];
      } else {
        conditionValue = variableValue;
      }
    } else {
      conditionValue = condition.value;
    }

    return conditionValue;
  }

  public static getArrayValueByPath(
    source: ValuePathDescription,
    userContext: WebUserContext,
    utils: WebBotRuntimeUtils,
  ): unknown[] {
    const values = this.getVariableValue(
      source,
      userContext,
      utils,
    ) as unknown[];

    if (!Array.isArray(values)) {
      if (isPlainObject(values)) {
        return [values];
      }

      throw new Error('InvalidOperationError: values is not array');
    }

    return values;
  }

  public static getVariableValue(
    source: ValuePathDescription,
    userContext: WebUserContext,
    utils: WebBotRuntimeUtils,
  ) {
    const sourceVariableId = source.variableId;
    const path = source.path;

    if (isNil(sourceVariableId)) {
      throw new Error('InvalidOperationError: sourceVariableId is null');
    }

    const sourceVariable = utils.getVariableById(sourceVariableId);
    const variableValue = userContext.getVariableValueByName(
      sourceVariable.name,
    );

    let value: unknown;

    if (
      !isNil(path) &&
      typeof variableValue === 'object' &&
      !Array.isArray(variableValue)
    ) {
      value = variableValue[path] as unknown[];
    } else {
      value = variableValue as unknown[];
    }

    if (isNil(value)) {
      throw new Error('Variable value is null');
    }

    return value;
  }
}
