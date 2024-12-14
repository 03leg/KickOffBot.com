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
import { WebUserContext } from './WebUserContext';
import { WebBotRuntimeUtils } from './WebBotRuntimeUtils';
import { ConditionChecker } from './ConditionChecker';
import { LogService } from './log/LogService';

export class ChangeArrayVariableHelper {
  public static getArrayValue(
    workflow: ChangeArrayVariableWorkflow,
    variable: BotVariable,
    userContext: WebUserContext,
    utils: WebBotRuntimeUtils,
    logService: LogService,
  ) {
    const sourceVariableValue = userContext.getVariableValueByName(
      variable.name,
    ) as unknown[];

    if (!Array.isArray(sourceVariableValue)) {
      logService.error(
        `Source variable ${variable.name} is not an array. It has type ${typeof sourceVariableValue}. Skipping...`,
      );
      return [];
    }

    switch (workflow.operation) {
      case ChangeArrayOperation.Add: {
        if (isNil(workflow.addDescription?.variableSourceDescription?.path)) {
          logService.error(
            `Add items. Path is not defined. Default value is empty array.`,
          );
          return [];
        }

        let values = this.getArrayValueByPath(
          workflow.addDescription.variableSourceDescription.path,
          userContext,
          utils,
          logService,
        );

        values = this.applyFilter(
          logService,
          userContext,
          utils,
          values,
          workflow.addDescription.variableSourceDescription.extraFilter,
        );

        return [...sourceVariableValue, ...values];
      }
      case ChangeArrayOperation.Set: {
        if (isNil(workflow.setDescription?.variableSourceDescription?.path)) {
          logService.error(
            `Set items. Path is not defined. Default value is empty array.`,
          );
          return [];
        }

        let values = this.getArrayValueByPath(
          workflow.setDescription.variableSourceDescription.path,
          userContext,
          utils,
          logService,
        );

        values = this.applyFilter(
          logService,
          userContext,
          utils,
          values,
          workflow.setDescription.variableSourceDescription.extraFilter,
        );

        return [...values];
      }
      case ChangeArrayOperation.Remove: {
        if (isNil(workflow.removeDescription)) {
          logService.error(
            `Remove items. Config is not defined. Default value is empty array.`,
          );
          return [];
        }

        if (sourceVariableValue.length === 0) {
          return [];
        }

        const removedItems: unknown[] = [];

        for (const value of sourceVariableValue) {
          const checks: boolean[] = [];

          for (const condition of workflow.removeDescription?.conditions ??
            []) {
            checks.push(
              this.checkValue(userContext, utils, condition, value, logService),
            );
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
      }

      default: {
        throw new Error('NotImplementedError. Not supported operation.');
      }
    }
  }

  private static applyFilter(
    logService: LogService,
    userContext: WebUserContext,
    utils: WebBotRuntimeUtils,
    values: unknown[],
    filter?: AddValueToArrayFilterDescription,
  ): unknown[] {
    if (isNil(filter)) {
      return values;
    }

    const result = this.checkConditions(
      logService,
      userContext,
      utils,
      values,
      filter.conditions,
      filter.logicalOperator,
    );

    return result;
  }

  public static checkConditions(
    logService: LogService,
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
        const check = this.checkValue(
          userContext,
          utils,
          condition,
          value,
          logService,
        );
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
    logService: LogService,
  ): boolean {
    if (isNil(condition.operator)) {
      logService.error(
        `Condition operator is not defined. Default value for condition is false.`,
      );
      return false;
    }

    const conditionValue = this.getConditionValue(
      userContext,
      utils,
      condition,
      logService,
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
    logService: LogService,
  ): unknown {
    let conditionValue: unknown;

    if (!isNil(condition.variableIdValue)) {
      const variable = utils.getVariableById(condition.variableIdValue);
      if (isNil(variable)) {
        logService.error(
          `Couldn't find variable in condition. Condition value is null`,
        );
        return null;
      }

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
    logService: LogService,
  ): unknown[] {
    const values = this.getVariableValue(
      source,
      userContext,
      utils,
      logService,
    ) as unknown[];

    if (isNil(values)) {
      logService.error(
        'InvalidOperationError: it is not possible to get array. Variable value is null',
      );
      return [];
    }

    if (!Array.isArray(values)) {
      if (isPlainObject(values)) {
        return [values];
      }

      logService.error(
        'InvalidOperationError: it is not possible to get array',
      );

      return [];
    }

    return values;
  }

  public static getVariableValue(
    source: ValuePathDescription,
    userContext: WebUserContext,
    utils: WebBotRuntimeUtils,
    logService: LogService,
  ) {
    const sourceVariableId = source.variableId;
    const path = source.path;

    if (isNil(sourceVariableId)) {
      logService.error(
        "Please configure source variable. It's required for correct operation",
      );
      return null;
    }

    const sourceVariable = utils.getVariableById(sourceVariableId);

    if (isNil(sourceVariable)) {
      logService.error(
        'Could not find variable for getting value. Default value is null',
      );
      return null;
    }

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
      logService.error('Variable value is null. It is not correct value');
      return null;
    }

    return value;
  }
}
