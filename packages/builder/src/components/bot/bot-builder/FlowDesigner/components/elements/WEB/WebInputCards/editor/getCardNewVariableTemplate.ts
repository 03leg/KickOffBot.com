import {
  BotVariable,
  VariableType,
  WebCardsSourceStrategy,
} from "@kickoffbot.com/types";

export const getCardNewVariableTemplate = (
  strategy: WebCardsSourceStrategy,
  multipleChoiceValue: boolean
): Partial<BotVariable> | undefined => {
  if (strategy === WebCardsSourceStrategy.Static) {
    if (!multipleChoiceValue) {
      return {
        type: VariableType.STRING,
        value: "will be replaced with  card value",
      };
    } else {
      return {
        type: VariableType.ARRAY,
        arrayItemType: VariableType.STRING,
        value:
          '["will be replaced with card value #1", "will be replaced with  card value #2"]',
      };
    }
  }

  if (strategy === WebCardsSourceStrategy.Dynamic) {
    return {
      type: VariableType.ARRAY,
      value: "[]",
    };
  }

  return undefined;
};
