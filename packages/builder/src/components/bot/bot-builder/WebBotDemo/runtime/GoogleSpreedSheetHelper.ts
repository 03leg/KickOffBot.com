/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  BotProject,
  GoogleSheetsIntegrationUIElement,
  SpreadSheetRowsFilter,
  SpreadSheetRowsFilterConditionItem,
  UpdateRowsFromObjectVariableDescription,
  VariableType,
} from "@kickoffbot.com/types";
import { WebUserContext } from "./WebUserContext";
import axios from "axios";
import { isNil, isPlainObject } from "lodash";
import { WebBotManagerUtils } from "./WebBotManager.utils";

export class GoogleSpreedSheetHelper {
  constructor(private _botProject: BotProject) {}

  private static getConditionValue(
    item: SpreadSheetRowsFilterConditionItem,
    userContext: WebUserContext,
    utils: WebBotManagerUtils
  ): string | number | boolean {
    if (!isNil(item.variableIdValue)) {
      const variable = utils.getVariableById(item.variableIdValue);
      const currentVariableValue = userContext.getVariableValueByName(
        variable.name
      );

      if (
        variable.type === VariableType.OBJECT &&
        isPlainObject(currentVariableValue) &&
        item.pathVariableIdValue
      ) {
        // @ts-ignore
        return (currentVariableValue as Record<string, unknown>)[
          item.pathVariableIdValue
        ];
      }

      // @ts-ignore
      return currentVariableValue;
    }

    // @ts-ignore
    return item.value;
  }

  private static convertStringSheetCellValue(
    cellValue: string,
    sampleValue: unknown
  ): unknown {
    try {
      switch (typeof sampleValue) {
        case "boolean": {
          if (
            cellValue.toUpperCase() === "TRUE" ||
            cellValue.toUpperCase() === "YES" ||
            cellValue.toUpperCase() === "1"
          ) {
            return true;
          }

          return false;
        }
        case "number": {
          return Number(cellValue.replace(",", "."));
        }
      }
    } catch {}

    return cellValue;
  }

  private static getValueFilter(
    filter: SpreadSheetRowsFilter | undefined,
    userContext: WebUserContext,
    utils: WebBotManagerUtils
  ) {
    if (isNil(filter) || filter.conditions.length === 0) {
      return undefined;
    }

    for (const condition of filter.conditions) {
      condition.value = GoogleSpreedSheetHelper.getConditionValue(
        condition,
        userContext,
        utils
      );
    }

    return filter;
  }

  public async insertRowsFromVariable(
    element: GoogleSheetsIntegrationUIElement,
    userContext: WebUserContext
  ) {
    const variable = this._botProject.variables.find(
      (v) => v.id === element.dataOperationDescription?.variableId
    );

    if (isNil(variable)) {
      throw new Error("InvalidOperationError: variable is not array of object");
    }

    const actualVariableValue = userContext.getVariableValueByName(
      variable.name
    );

    const host = window.location.origin;

    await axios.post(
      host +
        `/api/google-spreadsheet/insertData?connectionId=${element.connectionId}&spreadsheetId=${element.selectedSpreadSheet?.id}&sheetId=${element.selectedSheet?.id}`,
      {
        data: JSON.stringify(actualVariableValue),
      }
    );
  }

  public async updateRowsFromObjectVariable(
    element: GoogleSheetsIntegrationUIElement,
    userContext: WebUserContext,
    utils: WebBotManagerUtils
  ) {
    const operationDescription =
      element.dataOperationDescription as UpdateRowsFromObjectVariableDescription;
    const variable = this._botProject.variables.find(
      (v) => v.id === operationDescription?.variableId
    );

    if (isNil(variable)) {
      throw new Error("InvalidOperationError: variable is not array of object");
    }

    const actualVariableValue = userContext.getVariableValueByName(
      variable.name
    );

    if (
      variable.type !== VariableType.OBJECT ||
      !isPlainObject(actualVariableValue)
    ) {
      return;
    }

    const host = window.location.origin;
    const filterWithoutVariable = GoogleSpreedSheetHelper.getValueFilter(
      operationDescription.filter,
      userContext,
      utils
    );

    await axios.post(
      host +
        `/api/google-spreadsheet/updateData?connectionId=${element.connectionId}&spreadsheetId=${element.selectedSpreadSheet?.id}&sheetId=${element.selectedSheet?.id}`,
      {
        data: JSON.stringify({
          newValue: actualVariableValue,
          filter: filterWithoutVariable,
        }),
      }
    );
  }

  public async readRowsToArray(
    element: GoogleSheetsIntegrationUIElement,
    userContext: WebUserContext
  ) {
    const variable = this._botProject.variables.find(
      (v) => v.id === element.dataOperationDescription?.variableId
    );

    if (
      isNil(variable) ||
      (variable.type !== VariableType.ARRAY &&
        variable.arrayItemType !== VariableType.OBJECT)
    ) {
      throw new Error("InvalidOperationError: variable is not array of object");
    }

    const variableValue = JSON.parse(variable.value as string);

    if (!Array.isArray(variableValue) && variableValue.length > 0) {
      return;
    }

    const arrayItemSample = variableValue[0];
    const props = Object.keys(arrayItemSample);
    const host = window.location.origin;

    const response = await axios.get(
      host + "/api/google-spreadsheet/readData",
      {
        params: {
          connectionId: element.connectionId,
          spreadsheetId: element.selectedSpreadSheet?.id,
          sheetId: element.selectedSheet?.id,
          headers: JSON.stringify(props),
        },
      }
    );

    const resultItems = [];

    for (const row of response.data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj: any = {};
      for (const prop of props) {
        obj[prop] =
          typeof row[prop] === "string"
            ? GoogleSpreedSheetHelper.convertStringSheetCellValue(
                row[prop],
                arrayItemSample[prop]
              )
            : row[prop];
      }
      resultItems.push(obj);
    }

    userContext.updateVariable(variable.name, resultItems);
  }
}
