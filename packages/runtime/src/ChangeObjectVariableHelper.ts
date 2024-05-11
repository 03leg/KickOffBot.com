import { ArrayFilterType, ChangeObjectVariableDataSource, ChangeObjectVariableWorkflow } from "@kickoffbot.com/types";
import { MyBotUtils } from "./MyBotUtils";
import { UserContext } from "./UserContext";
import { ChangeArrayVariableHelper } from "./ChangeArrayVariableHelper";
import { throwIfNil } from "./guard";

export class ChangeObjectVariableHelper {
  public static getObjectValue(workflow: ChangeObjectVariableWorkflow, userContext: UserContext, utils: MyBotUtils) {
    if (workflow.source === ChangeObjectVariableDataSource.JSON) {
      throw new Error("NotImplementedError");
    }

    throwIfNil(workflow.variableSource?.variableId);

    const value = ChangeArrayVariableHelper.getVariableValue(
      {
        path: workflow.variableSource?.path,
        variableId: workflow.variableSource.variableId,
      },
      userContext,
      utils
    );
    
    if(typeof value === 'object' && !Array.isArray(value)){
        return value;
    }

    const arrayFromVariable = value as unknown[];

    switch (workflow.variableSource.arrayFilter?.mode) {
      case ArrayFilterType.FIRST: {
        return arrayFromVariable[0];
      }

      case ArrayFilterType.LAST: {
        return arrayFromVariable[arrayFromVariable.length - 1];
      }
      case ArrayFilterType.RANDOM_ITEM: {
        return arrayFromVariable[Math.floor(Math.random() * arrayFromVariable.length)];
      }
      case ArrayFilterType.CONDITIONS: {
        const filterArray = ChangeArrayVariableHelper.checkConditions(
          userContext,
          utils,
          arrayFromVariable,
          workflow.variableSource.arrayFilter?.conditions,
          workflow.variableSource.arrayFilter?.logicalOperator
        );

        return filterArray[0];
      }

      default: {
        throw new Error("NotImplemented");
      }
    }
  }
}
