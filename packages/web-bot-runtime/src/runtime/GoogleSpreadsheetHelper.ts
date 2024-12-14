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
import { WebUserContext } from './WebUserContext';
import { isNil, isPlainObject } from 'lodash';
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { WebBotRuntimeUtils } from './WebBotRuntimeUtils';
import { ConditionChecker } from './ConditionChecker';
import { BotStore } from './BotStore';
import { LogService } from './log/LogService';

export class GoogleSpreadsheetHelper {
  private _googleOAuthClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  constructor(
    private _botProject: BotProject,
    private _userContext: WebUserContext,
    private _utils: WebBotRuntimeUtils,
    private _logService: LogService,
  ) {}

  public async handleElement(element: GoogleSheetsIntegrationUIElement) {
    if (
      isNil(element.connectionId) ||
      isNil(element.selectedSpreadSheet?.id) ||
      isNil(element.selectedSheet?.id)
    ) {
      this._logService.error(
        'Missing required data for Google Sheets integration. Please check connectionId/selectedSpreadSheet/selectedSheet',
      );
      return;
    }
    const integrationAccount = await BotStore.getGoogleIntegrationAccount(
      element.connectionId,
    );
    if (isNil(integrationAccount)) {
      this._logService.error(`Integration account not found`);
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
    if (
      isNil(element.selectedSpreadSheet?.id) ||
      isNil(element.selectedSheet?.id)
    ) {
      this._logService.error(
        'Missing required data for Google Sheets integration. Please check selectedSpreadSheet/selectedSheet',
      );
      return;
    }

    this._logService.debug(`Read rows from Google Sheet`);

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

    if (isNil(variable)) {
      this._logService.error('Cannot find variable to update. Skipping...');
      return;
    }

    if (
      variable.type !== VariableType.ARRAY &&
      variable.arrayItemType !== VariableType.OBJECT
    ) {
      this._logService.error(
        'Variable is not an array of objects. Please check variable type. Skipping...',
      );
      return;
    }

    const variableValue = JSON.parse(variable.value as string);

    if (!Array.isArray(variableValue) && variableValue.length > 0) {
      this._logService.error(
        'Variable is not an array of objects. Please check variable type. Skipping...',
      );
      return;
    }

    this._logService.debug(`Read ${rows.length} rows from Google Sheet`);

    const arrayItemSample = variableValue[0];
    const props = Object.keys(arrayItemSample);
    const resultItems = [];

    this._logService.debug(
      `Converting rows to array of objects for variable ${variable.name}. Columns: ${props.join(',')}`,
    );

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

    this._logService.debug(
      `Updating variable ${variable.name} with ${resultItems.length} items.`,
    );

    this._userContext.updateVariable(variable.name, resultItems);
  }

  private async insertRowsFromVariable(
    element: GoogleSheetsIntegrationUIElement,
  ) {
    if (
      isNil(element.selectedSpreadSheet?.id) ||
      isNil(element.selectedSheet?.id)
    ) {
      this._logService.error(
        'Missing required data for Google Sheets integration. Please check selectedSpreadSheet/selectedSheet',
      );
      return;
    }

    this._logService.debug(`Insert rows from variable to Google Sheet`);

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
      this._logService.error(
        'Cannot find variable with items to insert into Google Sheet. Skipping...',
      );
      return;
    }

    const actualVariableValue = this._userContext.getVariableValueByName(
      variable.name,
    );

    if (
      variable.type === VariableType.OBJECT &&
      isPlainObject(actualVariableValue)
    ) {
      await sheet.addRow(actualVariableValue as Record<string, string>);
      this._logService.debug(
        `Inserted row from variable ${variable.name} [object] to Google Sheet`,
      );
    } else if (
      variable.type === VariableType.ARRAY &&
      Array.isArray(actualVariableValue)
    ) {
      await sheet.addRows(actualVariableValue as Record<string, string>[]);
      this._logService.debug(
        `Inserted rows from variable ${variable.name} [array of objects] to Google Sheet`,
      );
    } else {
      this._logService.error(
        `Variable ${variable.name} is not an array of objects or object. Please check variable type / variable value. Skipping...`,
      );
    }
  }

  private async updateRowsFromObjectVariable(
    element: GoogleSheetsIntegrationUIElement,
  ) {
    if (
      isNil(element.selectedSpreadSheet?.id) ||
      isNil(element.selectedSheet?.id)
    ) {
      this._logService.error(
        'Missing required data for Google Sheets integration. Please check selectedSpreadSheet/selectedSheet',
      );
      return;
    }

    this._logService.debug(`Update rows from variable to Google Sheet`);

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
      this._logService.error(
        `Cannot find variable with items to update in Google Sheet. Skipping...`,
      );
      return;
    }

    const actualVariableValue = this._userContext.getVariableValueByName(
      variable.name,
    );

    if (
      variable.type !== VariableType.OBJECT ||
      !isPlainObject(actualVariableValue)
    ) {
      this._logService.error(
        `Variable ${variable.name} is not an object. Please check variable type / variable value. Skipping...`,
      );
      return;
    }

    let rowIndex = 1;
    const rows = await sheet.getRows();
    for (const row of rows) {
      rowIndex += 1;

      if (!this.isTargetRow(row, operationDescription.filter)) {
        this._logService.debug(
          `Skipping row ${rowIndex} as it does not match filter`,
        );
        continue;
      }

      this._logService.debug(
        `Updating row ${rowIndex} with variable ${variable.name} value`,
      );

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
      if (isNil(variable)) {
        this._logService.error(
          `Couldn't get variable value for getting condition value. Default value is null`,
        );
        return null;
      }
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
