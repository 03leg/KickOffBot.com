import {
  BotProject,
  ButtonPortDescription,
  ButtonsSourceStrategy,
  ElementType,
  FlowDesignerUIBlockDescription,
  InputButtonsUIElement,
  UIElement,
} from "@kickoffbot.com/types";
import { UserContext } from "./UserContext";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { MyBotUtils } from "./MyBotUtils";
import { ChangeArrayVariableHelper } from "./ChangeArrayVariableHelper";
import { isNil } from "lodash";
import { throwIfNil } from "./guard";

export class MessageButtonsManager {
  public static getButtonsForMessage(
    userContext: UserContext,
    block: FlowDesignerUIBlockDescription,
    element: UIElement,
    utils: MyBotUtils
  ): InlineKeyboardButton.CallbackButton[][] | null {
    let result: InlineKeyboardButton.CallbackButton[][] = [];

    if (block.elements[block.elements.length - 1] == element) {
      return null;
    }

    const nextElement = block.elements[block.elements.findIndex((e) => e.id === element.id) + 1];

    if (nextElement.type === ElementType.INPUT_BUTTONS) {
      const buttonsElement = nextElement as InputButtonsUIElement;

      if (buttonsElement.strategy === ButtonsSourceStrategy.Manual) {
        result = this.getManualButtons(buttonsElement, utils, userContext);
      } else if (buttonsElement.strategy === ButtonsSourceStrategy.FromVariable) {
        result = this.getButtonsFromVariable(buttonsElement, utils, userContext);
      }

      const nextBlockButtons = this.getButtonsForMessage(userContext, block, nextElement, utils);
      if (nextBlockButtons !== null) {
        result.push(...nextBlockButtons);
      }
    }

    if (result.length === 0) {
      return null;
    }

    return result;
  }

  private static getButtonsFromVariable(buttonsElement: InputButtonsUIElement, utils: MyBotUtils, userContext: UserContext) {
    const result: InlineKeyboardButton.CallbackButton[][] = [];

    if (isNil(buttonsElement.variableButtonsSource?.variableSource)) {
      throw new Error("InvalidOperationError: variableSource is null");
    }

    const items = ChangeArrayVariableHelper.getArrayValueByPath(buttonsElement.variableButtonsSource?.variableSource, userContext, utils);

    for (const item of items) {
      if (isNil(buttonsElement.variableButtonsSource.customTextTemplate)) {
        throw new Error("InvalidOperationError: customTextTemplate is null");
      }

      result.push([
        {
          callback_data: `v_${buttonsElement.id}_${items.indexOf(item)}`,
          text: this.getButtonText(item, buttonsElement.variableButtonsSource.customTextTemplate, utils, userContext),
        },
      ]);
    }

    return result;
  }

  private static getButtonText(item: unknown, customTextTemplate: string, utils: MyBotUtils, userContext: UserContext) {
    return utils.getParsedPropertyTemplate(customTextTemplate, item as Record<string, string>, userContext);
  }

  private static getManualButtons(buttonsElement: InputButtonsUIElement, utils: MyBotUtils, userContext: UserContext) {
    const result: InlineKeyboardButton.CallbackButton[][] = [];

    for (const button of buttonsElement.buttons ?? []) {
      const buttonContent = utils.getParsedText(button.content, userContext);

      result.push([{ callback_data: `m_${button.id}`, text: buttonContent }]);
    }

    return result;
  }

  public static getButtonsSourceStrategy(callbackData: string) {
    if (callbackData.split("_")[0] === "m") {
      return ButtonsSourceStrategy.Manual;
    } else if (callbackData.split("_")[0] === "v") {
      return ButtonsSourceStrategy.FromVariable;
    } else {
      throw new Error("InvalidOperationError: callbackData is invalid: "+ callbackData);
    }
  }

  public static handleCallbackQueryManual(callbackData: string, botProject: BotProject) {
    const buttonId = callbackData.split("_")[1];
    let link = botProject.links.find((l) => (l.output as ButtonPortDescription).buttonId === buttonId);

    if (isNil(link)) {
      const inputButtonsElement = (
        botProject.blocks
          .map((e) => e.elements)
          .flat(1)
          .filter((e) => e.type === ElementType.INPUT_BUTTONS) as InputButtonsUIElement[]
      ).find((e) => (e.buttons ?? []).some((b) => b.id === buttonId));

      link = botProject.links.find(
        (l) => (l.output as ButtonPortDescription).buttonId === `default-button-${inputButtonsElement?.id ?? ""}`
      );

      if (isNil(link)) {
        return null;
      }
    }

    return link;
  }

  public static handleCallbackQueryFromVariable(callbackData: string, botProject: BotProject, userContext: UserContext, utils: MyBotUtils) {
    const callbackDataArray = callbackData.split("_");
    const elementId = callbackDataArray[1];
    const buttonIndex = Number(callbackDataArray[2]);

    const defaultButtonLink = botProject.links.find(
      (l) => (l.output as ButtonPortDescription).buttonId === `default-button-${elementId ?? ""}`
    );

    const buttonsElement = (
      botProject.blocks
        .map((e) => e.elements)
        .flat(1)
        .filter((e) => e.type === ElementType.INPUT_BUTTONS) as InputButtonsUIElement[]
    ).find((e) => e.id === elementId);

    if (isNil(buttonsElement)) {
      throw new Error("ButtonsElement not found");
    }

    throwIfNil(buttonsElement.variableButtonsSource?.variableSource);
    throwIfNil(buttonsElement.variableButtonsSource?.answerVariableId);

    const items = ChangeArrayVariableHelper.getArrayValueByPath(buttonsElement.variableButtonsSource?.variableSource, userContext, utils);
    const answerVariable = utils.getVariableById(buttonsElement.variableButtonsSource?.answerVariableId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userContext.updateVariable(answerVariable.name, items[buttonIndex] as any);

    return defaultButtonLink;
  }
}
