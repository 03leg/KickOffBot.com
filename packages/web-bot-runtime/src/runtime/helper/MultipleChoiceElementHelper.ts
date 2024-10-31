import {
  DataSourceType,
  MultipleChoiceOptionDescription,
  WebMultipleChoiceUIElement,
} from '@kickoffbot.com/types';
import { WebBotRuntimeUtils } from '../WebBotRuntimeUtils';
import { WebUserContext } from '../WebUserContext';
import { isNil } from 'lodash';

export class MultipleChoiceElementHelper {
  constructor(
    private _element: WebMultipleChoiceUIElement,
    private _utils: WebBotRuntimeUtils,
    private _userContext: WebUserContext,
  ) {}

  public handleUserResponse(userOptions: MultipleChoiceOptionDescription[]) {
    if (isNil(this._element.variableId)) {
      return;
    }
    const variable = this._utils.getVariableById(this._element.variableId);

    if (this._element.dataSourceType === DataSourceType.Static) {
      this._userContext.updateVariable(
        variable.name,
        userOptions.map((o) => o.value),
      );
    } else if (this._element.dataSourceType === DataSourceType.Dynamic) {
      const dataSourceVariable = this._utils.getVariableById(
        this._element.dataSourceVariableId,
      );

      const dataSourceVariableValue = this._userContext.getVariableValueByName(
        dataSourceVariable.name,
      );

      if (!Array.isArray(dataSourceVariableValue)) {
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
