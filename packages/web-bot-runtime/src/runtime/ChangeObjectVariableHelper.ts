import {
  ChangeObjectVariableWorkflow,
  ChangeObjectVariableDataSource,
  ArrayFilterType,
  ChangeVariableUIElement,
  NOW_DATE_TIME_VARIABLE_NAME,
} from '@kickoffbot.com/types';
import { ChangeArrayVariableHelper } from './ChangeArrayVariableHelper';
import { WebUserContext } from './WebUserContext';
import { WebBotRuntimeUtils } from './WebBotRuntimeUtils';
import { LogService } from './log/LogService';
import { isNil } from 'lodash';

export class ChangeObjectVariableHelper {
  public static getObjectValue(
    element: ChangeVariableUIElement,
    userContext: WebUserContext,
    utils: WebBotRuntimeUtils,
    logService: LogService,
  ) {
    const workflow =
      element.workflowDescription as ChangeObjectVariableWorkflow;

    if (workflow.source === ChangeObjectVariableDataSource.JSON) {
      throw new Error('NotImplementedError');
    }

    if (workflow.source === ChangeObjectVariableDataSource.INSERT_PROPERTY) {
      return this.handleInsertPropertyToObject(
        element,
        userContext,
        utils,
        logService,
      );
    }

    if (workflow.source === ChangeObjectVariableDataSource.REMOVE_PROPERTY) {
      return this.handleRemovePropertyFromObject(
        element,
        userContext,
        utils,
        logService,
      );
    }

    if (isNil(workflow.variableSource?.variableId)) {
      logService.error(
        'Please configure source variable. It is required for correct operation. Skipping...',
      );
      return null;
    }

    const value = ChangeArrayVariableHelper.getVariableValue(
      {
        path: workflow.variableSource?.path,
        variableId: workflow.variableSource.variableId,
      },
      userContext,
      utils,
      logService,
    );

    if (typeof value === 'object' && !Array.isArray(value)) {
      return value;
    }

    const arrayFromVariable = this.getActualArrayValue(
      value as unknown[],
      workflow,
      userContext,
      utils,
      logService,
    );

    if (!Array.isArray(arrayFromVariable)) {
      return null;
    }

    switch (workflow.variableSource.arrayFilter?.mode) {
      case ArrayFilterType.FIRST: {
        return arrayFromVariable[0];
      }

      case ArrayFilterType.LAST: {
        return arrayFromVariable[arrayFromVariable.length - 1];
      }
      case ArrayFilterType.RANDOM_ITEM: {
        return arrayFromVariable[
          Math.floor(Math.random() * arrayFromVariable.length)
        ];
      }
      default: {
        return arrayFromVariable[0];
      }
    }
  }

  private static handleInsertPropertyToObject(
    element: ChangeVariableUIElement,

    userContext: WebUserContext,
    utils: WebBotRuntimeUtils,
    logService: LogService,
  ) {
    const workflow =
      element.workflowDescription as ChangeObjectVariableWorkflow;
    const value = ChangeArrayVariableHelper.getVariableValue(
      {
        variableId: element.selectedVariableId,
      },
      userContext,
      utils,
      logService,
    );

    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return value;
    }

    if (!workflow.propertyName || !workflow.propertyValue) {
      return value;
    }

    let parsedValue: unknown;
    const variableRefText = (workflow.propertyValue as string).trim();
    // doesn't support converters
    if (
      /<%variables.(.*?)%>/g.test(variableRefText) &&
      (variableRefText.match(/./g) || []).length === 1 &&
      variableRefText.includes('|') === false &&
      !variableRefText.startsWith(`<%variables.${NOW_DATE_TIME_VARIABLE_NAME}`)
    ) {
      const matches = variableRefText.matchAll(/<%variables.(.*?)%>/g);
      const match = matches.next();
      const variableName = match.value[1];
      parsedValue = userContext.getVariableValueByName(variableName);
    } else {
      parsedValue = utils.getParsedText(
        workflow.propertyValue as string,
        userContext,
      );
    }

    return { ...value, [workflow.propertyName]: parsedValue };
  }

  private static handleRemovePropertyFromObject(
    element: ChangeVariableUIElement,
    userContext: WebUserContext,
    utils: WebBotRuntimeUtils,
    logService: LogService,
  ) {
    const workflow =
      element.workflowDescription as ChangeObjectVariableWorkflow;
    const value = ChangeArrayVariableHelper.getVariableValue(
      {
        variableId: element.selectedVariableId,
      },
      userContext,
      utils,
      logService,
    );

    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return value;
    }

    if (!workflow.propertyName) {
      return value;
    }

    const newObject = { ...value };

    delete newObject[workflow.propertyName];

    return newObject;
  }

  private static getActualArrayValue(
    value: unknown[],
    workflow: ChangeObjectVariableWorkflow,
    userContext: WebUserContext,
    utils: WebBotRuntimeUtils,
    logService: LogService,
  ) {
    if (isNil(workflow.variableSource?.variableId)) {
      logService.error(
        'Variable source is not defined. Please configure source variable. It is required for correct operation',
      );
      return null;
    }

    if ((workflow.variableSource.arrayFilter?.conditions?.length ?? -1) === 0) {
      return value;
    }

    const filteredArray = ChangeArrayVariableHelper.checkConditions(
      logService,
      userContext,
      utils,
      value,
      workflow.variableSource.arrayFilter?.conditions,
      workflow.variableSource.arrayFilter?.logicalOperator,
    );

    return filteredArray;
  }
}
