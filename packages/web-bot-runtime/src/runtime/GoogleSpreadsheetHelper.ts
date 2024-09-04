import {
  GoogleSheetsIntegrationUIElement,
  VariableType,
  UpdateRowsFromObjectVariableDescription,
  BotProject,
  SpreadSheetRowsFilterConditionItem,
  ConditionOperator,
  LogicalOperator,
  SpreadSheetRowsFilter,
  DataSpreedSheetOperation,
} from '@kickoffbot.com/types';
import { OAuth2Client } from 'google-auth-library';
import { throwIfNil } from 'src/utils/guard';
import { WebUserContext } from './WebUserContext';
import { isNil, isPlainObject } from 'lodash';
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { WebBotRuntimeUtils } from './WebBotRuntimeUtils';
import { ConditionChecker } from './ConditionChecker';
import { BotStore } from './BotStore';

export class GoogleSpreadsheetHelper {
  private _googleOAuthClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  constructor(
    private _botProject: BotProject,
    private _userContext: WebUserContext,
    private _utils: WebBotRuntimeUtils,
  ) {}

  public async handleElement(element: GoogleSheetsIntegrationUIElement) {
    if (
      isNil(element.connectionId) ||
      isNil(element.selectedSpreadSheet?.id) ||
      isNil(element.selectedSheet?.id)
    ) {
      return;
    }
    const integrationAccount = await BotStore.getGoogleIntegrationAccount(
      element.connectionId,
    );
    if (isNil(integrationAccount)) {
      return;
    }
    const { credentials } = integrationAccount;
    this._googleOAuthClient.setCredentials(JSON.parse(atob(credentials)));

    switch (element.dataOperation) {
      case DataSpreedSheetOperation.READ_ROWS_TO_ARRAY: {
        await this.readRowsToArray(element);
        break;
      }
      case DataSpreedSheetOperation.INSERT_ROWS_FROM_VARIABLE: {
        await this.insertRowsFromVariable(element);
        break;
      }
      case DataSpreedSheetOperation.UPDATE_ROWS_FROM_OBJECT_VARIABLE: {
        await this.updateRowsFromObjectVariable(element);
        break;
      }
      default:
        throw new Error('InvalidOperationError: Unknown data operation');
    }
  }

  private async readRowsToArray(element: GoogleSheetsIntegrationUIElement) {
    throwIfNil(element.selectedSpreadSheet?.id);
    throwIfNil(element.selectedSheet?.id);

    const spreadSheet = new GoogleSpreadsheet(
      element.selectedSpreadSheet.id,
      this._googleOAuthClient,
    );
    await spreadSheet.loadInfo();
    const sheet = spreadSheet.sheetsById[element.selectedSheet.id];
    const rows = await sheet.getRows();
    const variable = this._botProject.variables.find(
      (v) => v.id === element.dataOperationDescription?.variableId,
    );

    if (
      isNil(variable) ||
      (variable.type !== VariableType.ARRAY &&
        variable.arrayItemType !== VariableType.OBJECT)
    ) {
      throw new Error('InvalidOperationError: variable is not array of object');
    }

    const variableValue = JSON.parse(variable.value as string);

    if (!Array.isArray(variableValue) && variableValue.length > 0) {
      return;
    }

    const arrayItemSample = variableValue[0];
    const props = Object.keys(arrayItemSample);
    const resultItems = [];

    for (const row of rows) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj: any = {};
      for (const prop of props) {
        obj[prop] =
          typeof row.get(prop) === 'string'
            ? WebBotRuntimeUtils.convertStringSheetCellValue(
                row.get(prop),
                arrayItemSample[prop],
              )
            : row.get(prop);
      }
      resultItems.push(obj);
    }

    this._userContext.updateVariable(variable.name, resultItems);
  }

  private async insertRowsFromVariable(
    element: GoogleSheetsIntegrationUIElement,
  ) {
    throwIfNil(element.selectedSpreadSheet?.id);
    throwIfNil(element.selectedSheet?.id);

    const spreadSheet = new GoogleSpreadsheet(
      element.selectedSpreadSheet.id,
      this._googleOAuthClient,
    );
    await spreadSheet.loadInfo();
    const sheet = spreadSheet.sheetsById[element.selectedSheet.id];

    const variable = this._botProject.variables.find(
      (v) => v.id === element.dataOperationDescription?.variableId,
    );

    if (isNil(variable)) {
      throw new Error('InvalidOperationError: variable is not array of object');
    }

    const actualVariableValue = this._userContext.getVariableValueByName(
      variable.name,
    );

    if (
      variable.type === VariableType.OBJECT &&
      isPlainObject(actualVariableValue)
    ) {
      await sheet.addRow(actualVariableValue as Record<string, string>);
    }

    if (
      variable.type === VariableType.ARRAY &&
      Array.isArray(actualVariableValue)
    ) {
      await sheet.addRows(actualVariableValue as Record<string, string>[]);
    }
  }

  private async updateRowsFromObjectVariable(
    element: GoogleSheetsIntegrationUIElement,
  ) {
    throwIfNil(element.selectedSpreadSheet?.id);
    throwIfNil(element.selectedSheet?.id);

    const operationDescription =
      element.dataOperationDescription as UpdateRowsFromObjectVariableDescription;

    const spreadSheet = new GoogleSpreadsheet(
      element.selectedSpreadSheet.id,
      this._googleOAuthClient,
    );
    await spreadSheet.loadInfo();
    const sheet = spreadSheet.sheetsById[element.selectedSheet.id];

    const variable = this._botProject.variables.find(
      (v) => v.id === element.dataOperationDescription?.variableId,
    );
    if (isNil(variable)) {
      return;
    }

    const actualVariableValue = this._userContext.getVariableValueByName(
      variable.name,
    );

    if (
      variable.type !== VariableType.OBJECT ||
      !isPlainObject(actualVariableValue)
    ) {
      return;
    }

    const rows = await sheet.getRows();
    for (const row of rows) {
      if (!this.isTargetRow(row, operationDescription.filter)) {
        continue;
      }

      row.assign({ ...(actualVariableValue as object) });

      await row.save();
    }
  }

  private isTargetRow(
    row: GoogleSpreadsheetRow<Record<string, any>>,
    filter: SpreadSheetRowsFilter | undefined,
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

    throw new Error('NotImplementedError');
  }

  private checkItem(
    item: SpreadSheetRowsFilterConditionItem,
    row: GoogleSpreadsheetRow<Record<string, any>>,
  ): boolean {
    if (isNil(item.header) || isNil(item.operator)) {
      return false;
    }

    const cellValue = row.get(item.header);
    const conditionValue = this.getConditionValue(item);

    switch (item.operator) {
      case ConditionOperator.EQUAL_TO: {
        return GoogleSpreadsheetHelper.equal(cellValue, conditionValue);
      }
      case ConditionOperator.NOT_EQUAL_TO: {
        return !GoogleSpreadsheetHelper.equal(cellValue, conditionValue);
      }
      case ConditionOperator.LESS_THAN:
      case ConditionOperator.GREATER_THAN: {
        return ConditionChecker.checkNumberItem(
          Number(cellValue),
          Number(conditionValue),
          item.operator,
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
          item.operator,
        );
      }
    }
  }

  private static equal(cellValue: any, conditionValue: any) {
    if (isNil(cellValue) && isNil(conditionValue)) {
      return true;
    }

    switch (typeof conditionValue) {
      case 'number': {
        return Number(cellValue) === Number(conditionValue);
      }
      case 'string': {
        return cellValue.toString() === conditionValue.toString();
      }
      case 'boolean': {
        return (
          conditionValue ===
          (typeof cellValue !== 'boolean'
            ? cellValue.toString().toLowerCase() === 'true' ||
              cellValue.toString().toLowerCase() === 'yes' ||
              cellValue.toString().toLowerCase() === '1'
            : cellValue)
        );
      }
    }

    return cellValue == conditionValue;
  }

  private getConditionValue(item: SpreadSheetRowsFilterConditionItem) {
    if (!isNil(item.variableIdValue)) {
      const variable = this._utils.getVariableById(item.variableIdValue);
      const currentVariableValue = this._userContext.getVariableValueByName(
        variable.name,
      );

      if (
        variable.type === VariableType.OBJECT &&
        isPlainObject(currentVariableValue) &&
        item.pathVariableIdValue
      ) {
        return (currentVariableValue as Record<string, unknown>)[
          item.pathVariableIdValue
        ];
      }

      return currentVariableValue;
    }

    return item.value;
  }
}
