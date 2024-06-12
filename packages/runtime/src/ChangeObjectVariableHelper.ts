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
      utils,
    );

    if (typeof value === "object" && !Array.isArray(value)) {
      return value;
    }

    const arrayFromVariable = this.getActualArrayValue(value as unknown[], workflow, userContext, utils);

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
      default: {
        return arrayFromVariable[0];
      }
    }
  }

  private static getActualArrayValue(value: unknown[], workflow: ChangeObjectVariableWorkflow, userContext: UserContext, utils: MyBotUtils) {
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
