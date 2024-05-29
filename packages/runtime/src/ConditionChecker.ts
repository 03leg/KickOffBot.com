import { ConditionItem, ConditionOperator, ConditionUIElement, LogicalOperator, VariableType } from "@kickoffbot.com/types";
import { MyBotUtils } from "./MyBotUtils";
import { UserContext } from "./UserContext";
import { isEmpty, isNil } from "lodash";
import { throwIfNil } from "./guard";

export class ConditionChecker {
  public static check(element: ConditionUIElement, utils: MyBotUtils, userContext: UserContext): boolean {
    if (isNil(element.items) || element.items.length === 0) {
      return false;
    }

    const resultArray = [];
    for (const item of element.items) {
      const itemResult = this.checkItem(item, utils, userContext);
      resultArray.push(itemResult);
    }

    if (element.logicalOperator === LogicalOperator.AND) {
      return resultArray.every((p) => p);
    }

    if (element.logicalOperator === LogicalOperator.OR) {
      return resultArray.some((p) => p);
    }

    if (resultArray.length === 1) {
      return resultArray[0];
    }

    throw new Error("NotImplementedError");
  }

  private static checkItem(item: ConditionItem, utils: MyBotUtils, userContext: UserContext): boolean {
    throwIfNil(item.operator);
    throwIfNil(item.variableId);

    const variable = utils.getVariableById(item.variableId);
    const currentVariableValue = userContext.getVariableValueByName(variable.name);
    let conditionValue: number | string | boolean | undefined | unknown[] | Record<string, unknown> = undefined;

    if (isNil(item.variableIdValue)) {
      conditionValue = item.value;
    } else {
      const variableValue = utils.getVariableById(item.variableIdValue);
      const currentValue = userContext.getVariableValueByName(variableValue.name);
      conditionValue = currentValue;
    }

    switch (variable.type) {
      case VariableType.STRING: {
        return this.checkStringItem(currentVariableValue as string, conditionValue as string, item.operator);
      }
      case VariableType.NUMBER: {
        return this.checkNumberItem(currentVariableValue as number, conditionValue as number, item.operator);
      }
      case VariableType.BOOLEAN: {
        return this.checkBooleanItem(currentVariableValue as boolean, conditionValue as boolean, item.operator);
      }
      case VariableType.OBJECT: {
        return this.checkObjectItem(currentVariableValue as Record<string, unknown>, item.path, conditionValue, item.operator);
      }
      default: {
        throw new Error("NotImplementedError");
      }
    }
  }

  static checkObjectItem(
    currentVariableValue: Record<string, unknown>,
    path: string | undefined,
    conditionValue: number | string | boolean | undefined | unknown[] | Record<string, unknown>,
    operator: ConditionOperator
  ): boolean {
    throwIfNil(path);
    throwIfNil(conditionValue);
    throwIfNil(operator);

    if (path in currentVariableValue === false) {
      throw new Error("InvalidOperationError: path not in currentVariableValue");
    }

    const actualValue = currentVariableValue[path];

    switch (typeof actualValue) {
      case VariableType.STRING: {
        return this.checkStringItem(actualValue as string, conditionValue as string, operator);
      }
      case VariableType.NUMBER: {
        return this.checkNumberItem(actualValue as number, conditionValue as number, operator);
      }
      case VariableType.BOOLEAN: {
        return this.checkBooleanItem(actualValue as boolean, conditionValue as boolean, operator);
      }
      default: {
        throw new Error("NotImplementedError. Type: " + typeof actualValue);
      }
    }
  }

  static checkBooleanItem(currentVariableValue: boolean, conditionValue: boolean, operator: ConditionOperator): boolean {
    switch (operator) {
      case ConditionOperator.EQUAL_TO: {
        return currentVariableValue === conditionValue;
      }
      case ConditionOperator.NOT_EQUAL_TO: {
        return currentVariableValue !== conditionValue;
      }
      default: {
        throw new Error("NotImplementedError");
      }
    }
  }

  static checkNumberItem(currentVariableValue: number, typedCurrentValue: number, operator: ConditionOperator): boolean {
    switch (operator) {
      case ConditionOperator.EQUAL_TO: {
        return currentVariableValue === typedCurrentValue;
      }
      case ConditionOperator.NOT_EQUAL_TO: {
        return currentVariableValue !== typedCurrentValue;
      }
      case ConditionOperator.GREATER_THAN: {
        return currentVariableValue > typedCurrentValue;
      }
      case ConditionOperator.LESS_THAN: {
        return currentVariableValue < typedCurrentValue;
      }
      default: {
        throw new Error("NotImplementedError");
      }
    }
  }
  static checkStringItem(currentValue: string, conditionValue: string, operator: ConditionOperator): boolean {
    switch (operator) {
      case ConditionOperator.EQUAL_TO: {
        return currentValue === conditionValue;
      }
      case ConditionOperator.NOT_EQUAL_TO: {
        return currentValue !== conditionValue;
      }
      case ConditionOperator.CONTAINS: {
        return currentValue.includes(conditionValue);
      }
      case ConditionOperator.DOES_NOT_CONTAIN: {
        return !currentValue.includes(conditionValue);
      }
      case ConditionOperator.IS_EMPTY: {
        return isEmpty(currentValue);
      }
      case ConditionOperator.STARTS_WITH: {
        return currentValue.startsWith(conditionValue);
      }
      case ConditionOperator.END_WITH: {
        return currentValue.endsWith(conditionValue);
      }
      case ConditionOperator.MATCHES_REGEX: {
        return currentValue.match(new RegExp(conditionValue)) != null; // new RegExp("^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$").test("123-456-7890")
      }
      case ConditionOperator.DOES_NOT_MATCHES_REGEX: {
        return currentValue.match(new RegExp(conditionValue)) == null;
      }
      default: {
        throw new Error("NotImplementedError");
      }
    }
  }
}
