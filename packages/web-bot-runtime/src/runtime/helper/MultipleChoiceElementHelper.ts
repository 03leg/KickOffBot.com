import {
  DataSourceType,
  MultipleChoiceOptionDescription,
  WebMultipleChoiceUIElement,
} from '@kickoffbot.com/types';
import { WebBotRuntimeUtils } from '../WebBotRuntimeUtils';
import { WebUserContext } from '../WebUserContext';
import { isNil } from 'lodash';
import { LogService } from '../log/LogService';

export class MultipleChoiceElementHelper {
  constructor(
    private _element: WebMultipleChoiceUIElement,
    private _utils: WebBotRuntimeUtils,
    private _userContext: WebUserContext,
    private _logService: LogService,
  ) {}

  public handleUserResponse(userOptions: MultipleChoiceOptionDescription[]) {
    if (isNil(this._element.variableId)) {
      this._logService.warn(
        `Variable for store user response is not set. Skipping...`,
      );
      return;
    }
    const variable = this._utils.getVariableById(this._element.variableId);

    if (isNil(variable)) {
      this._logService.error(
        'Could not find variable to store user response. Skipping...',
      );
      return;
    }

    if (this._element.dataSourceType === DataSourceType.Static) {
      this._userContext.updateVariable(
        variable.name,
        userOptions.map((o) => o.value),
      );
    } else if (this._element.dataSourceType === DataSourceType.Dynamic) {
      const dataSourceVariable = this._utils.getVariableById(
        this._element.dataSourceVariableId,
      );

      if (isNil(dataSourceVariable)) {
        this._logService.error(
          'Could not find variable with data source. Skipping...',
        );
        return;
      }

      const dataSourceVariableValue = this._userContext.getVariableValueByName(
        dataSourceVariable.name,
      );

      if (!Array.isArray(dataSourceVariableValue)) {
        this._logService.error(
          `InvalidOperationError: value of variable "${dataSourceVariable.name}" is not array. Skipping...`,
        );
        return;
      }

      const newValue = [];
      const selectedAutoIds = userOptions.map((o) => o.autoId);

      for (let i = 0; i < dataSourceVariableValue.length; i++) {
        const autoId = i.toString();
        if (selectedAutoIds.includes(autoId)) {
          newValue.push(dataSourceVariableValue[i]);
        }
      }

      this._userContext.updateVariable(variable.name, newValue);
    } else {
      throw new Error('InvalidOperationError: Unknown data source type');
    }
  }
}
