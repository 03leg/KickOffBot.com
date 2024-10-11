import {
  ChangeObjectVariableWorkflow,
  ChangeObjectVariableDataSource,
  ArrayFilterType,
  ChangeVariableUIElement,
} from '@kickoffbot.com/types';
import { throwIfNil } from 'src/utils/guard';
import { ChangeArrayVariableHelper } from './ChangeArrayVariableHelper';
import { WebUserContext } from './WebUserContext';
import { WebBotRuntimeUtils } from './WebBotRuntimeUtils';

export class ChangeObjectVariableHelper {
  public static getObjectValue(
    element: ChangeVariableUIElement,
    userContext: WebUserContext,
    utils: WebBotRuntimeUtils,
  ) {
    const workflow =
      element.workflowDescription as ChangeObjectVariableWorkflow;

    if (workflow.source === ChangeObjectVariableDataSource.JSON) {
      throw new Error('NotImplementedError');
    }

    if (workflow.source === ChangeObjectVariableDataSource.INSERT_PROPERTY) {
      return this.handleInsertPropertyToObject(element, userContext, utils);
    }

    if (workflow.source === ChangeObjectVariableDataSource.REMOVE_PROPERTY) {
      return this.handleRemovePropertyFromObject(element, userContext, utils);
    }

    throwIfNil(workflow.variableSource?.variableId);

    const value = ChangeArrayVariableHelper.getVariableValue(
      {
        path: workflow.variableSource?.path,
        variableId: workflow.variableSource.variableId,
      },
      userContext,
      utils,
    );

    if (typeof value === 'object' && !Array.isArray(value)) {
      return value;
    }

    const arrayFromVariable = this.getActualArrayValue(
      value as unknown[],
      workflow,
      userContext,
      utils,
    );

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
  ) {
    const workflow =
      element.workflowDescription as ChangeObjectVariableWorkflow;
    const value = ChangeArrayVariableHelper.getVariableValue(
      {
        variableId: element.selectedVariableId,
      },
      userContext,
      utils,
    );

    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return value;
    }

    if (!workflow.propertyName || !workflow.propertyValue) {
      return value;
    }

    let parsedValue: unknown;
    const variableRefText = (workflow.propertyValue as string).trim();
    if (/<%variables.(.*?)%>/g.test(variableRefText)) {
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
  ) {
    const workflow =
      element.workflowDescription as ChangeObjectVariableWorkflow;
    const value = ChangeArrayVariableHelper.getVariableValue(
      {
        variableId: element.selectedVariableId,
      },
      userContext,
      utils,
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
  ) {
    throwIfNil(workflow.variableSource?.variableId);

    if ((workflow.variableSource.arrayFilter?.conditions?.length ?? -1) === 0) {
      return value;
    }

    const filteredArray = ChangeArrayVariableHelper.checkConditions(
      userContext,
      utils,
      value,
      workflow.variableSource.arrayFilter?.conditions,
      workflow.variableSource.arrayFilter?.logicalOperator,
    );

    return filteredArray;
  }
}
