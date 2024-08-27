/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ConditionOperator,
  LogicalOperator,
  SpreadSheetRowsFilter,
  SpreadSheetRowsFilterConditionItem,
} from "@kickoffbot.com/types";
import { GoogleSpreadsheetRow } from "google-spreadsheet";
import { isNil } from "lodash";
import { ConditionChecker } from "~/components/bot/bot-builder/WebBotDemo/runtime/ConditionChecker";

export class SpreadSheetRowChecker {
  public static isTargetRow(
    row: GoogleSpreadsheetRow<Record<string, any>>,
    filter: SpreadSheetRowsFilter | undefined
  ) {
    if (isNil(filter)) {
      return true;
    }

    const resultArray: boolean[] = [];
    for (const condition of filter.conditions) {
      const itemResult = this.checkItem(condition, row);
      resultArray.push(itemResult);
    }

    if (filter.operator === LogicalOperator.AND) {
      return resultArray.every((p) => p);
    }

    if (filter.operator === LogicalOperator.OR) {
      return resultArray.some((p) => p);
    }

    if (resultArray.length === 1) {
      return resultArray[0];
    }

    throw new Error("NotImplementedError");
  }

  private static checkItem(
    item: SpreadSheetRowsFilterConditionItem,
    row: GoogleSpreadsheetRow<Record<string, any>>
  ): boolean {
    if (isNil(item.header) || isNil(item.operator)) {
      return false;
    }

    const cellValue = row.get(item.header);
    const conditionValue = this.getConditionValue(item);

    switch (item.operator) {
      case ConditionOperator.EQUAL_TO: {
        return this.equal(cellValue, conditionValue);
      }
      case ConditionOperator.NOT_EQUAL_TO: {
        return !this.equal(cellValue, conditionValue);
      }
      case ConditionOperator.LESS_THAN:
      case ConditionOperator.GREATER_THAN: {
        return ConditionChecker.checkNumberItem(
          Number(cellValue),
          Number(conditionValue),
          item.operator
        );
      }
      case ConditionOperator.DOES_NOT_CONTAIN:
      case ConditionOperator.IS_EMPTY:
      case ConditionOperator.STARTS_WITH:
      case ConditionOperator.END_WITH:
      case ConditionOperator.MATCHES_REGEX:
      case ConditionOperator.DOES_NOT_MATCHES_REGEX:
      case ConditionOperator.CONTAINS: {
        return ConditionChecker.checkStringItem(
          cellValue.toString(),
          (conditionValue as string).toString(),
          item.operator
        );
      }
    }
  }

  private static equal(cellValue: any, conditionValue: any) {
    if (isNil(cellValue) && isNil(conditionValue)) {
      return true;
    }

    switch (typeof conditionValue) {
      case "number": {
        return Number(cellValue) === Number(conditionValue);
      }
      case "string": {
        return cellValue.toString() === conditionValue.toString();
      }
      case "boolean": {
        return (
          conditionValue ===
          (typeof cellValue !== "boolean"
            ? cellValue.toString().toLowerCase() === "true" ||
              cellValue.toString().toLowerCase() === "yes" ||
              cellValue.toString().toLowerCase() === "1"
            : cellValue)
        );
      }
    }

    return cellValue == conditionValue;
  }

  private static getConditionValue(item: SpreadSheetRowsFilterConditionItem) {
    return item.value;
  }
}
