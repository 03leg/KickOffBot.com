import { BotVariable, VariableType } from "@kickoffbot.com/types";
import { isNil, isPlainObject } from "lodash";

const getResetObject = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      let newValue = value;

      switch (typeof value) {
        case "string":
          newValue = "";
          break;
        case "number":
          newValue = 0;
          break;
        case "boolean":
          newValue = false;
          break;
        case "object":
          if (Array.isArray(value)) {
            newValue = [];
          } else {
            newValue = getResetObject(value as Record<string, unknown>);
          }
          break;
      }

      return [key, newValue];
    })
  );
};

export const getNewVariableTemplateUserInput = (
  firstValueOfArray: unknown | null
): Partial<BotVariable> | undefined => {
  if (isNil(firstValueOfArray)) return undefined;

  if (isPlainObject(firstValueOfArray)) {
    return {
      type: VariableType.OBJECT,
      value: JSON.stringify(getResetObject(firstValueOfArray as Record<string, unknown>), null, 2),
    };
  }

  if (typeof firstValueOfArray === "string") {
    return {
      type: VariableType.STRING,
      value: "",
    };
  }

  if (typeof firstValueOfArray === "number") {
    return {
      type: VariableType.NUMBER,
      value: 0,
    };
  }

  if (typeof firstValueOfArray === "boolean") {
    return {
      type: VariableType.BOOLEAN,
      value: false,
    };
  }
};
