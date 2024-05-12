import {
  BotProject,
  ButtonPortDescription,
  ButtonsSourceStrategy,
  ContentTextUIElement,
  EditMessageUIElement,
  ElementType,
  MessageButtonsDescription,
  MessageContentDescription,
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
    elementId: string,
    messageContentDescription: MessageContentDescription,
    utils: MyBotUtils
  ): InlineKeyboardButton.CallbackButton[][] | null {
    if(!messageContentDescription.showButtons){
      return null;
    }

    const messageButtonsDescription = messageContentDescription.buttonsDescription;
    let result: InlineKeyboardButton.CallbackButton[][] = [];

    if (messageButtonsDescription.strategy === ButtonsSourceStrategy.Manual) {
      result = this.getManualButtons(messageButtonsDescription, utils, userContext);
    } else if (messageButtonsDescription.strategy === ButtonsSourceStrategy.FromVariable) {
      result = this.getButtonsFromVariable(elementId, messageButtonsDescription, utils, userContext);
    }

    if (result.length === 0) {
      return null;
    }

    return result;

  }

  private static getButtonsFromVariable(messageId: string, buttonsDescription: MessageButtonsDescription, utils: MyBotUtils, userContext: UserContext) {
    const result: InlineKeyboardButton.CallbackButton[][] = [];

    if (isNil(buttonsDescription.variableButtonsSource?.variableSource)) {
      throw new Error("InvalidOperationError: variableSource is null");
    }

    const items = ChangeArrayVariableHelper.getArrayValueByPath(buttonsDescription.variableButtonsSource?.variableSource, userContext, utils);

    for (const item of items) {
      if (isNil(buttonsDescription.variableButtonsSource.customTextTemplate)) {
        throw new Error("InvalidOperationError: customTextTemplate is null");
      }

      result.push([
        {
          callback_data: `v_${messageId}_${items.indexOf(item)}`,
          text: this.getButtonText(item, buttonsDescription.variableButtonsSource.customTextTemplate, utils, userContext),
        },
      ]);
    }

    return result;
  }

  private static getButtonText(item: unknown, customTextTemplate: string, utils: MyBotUtils, userContext: UserContext) {
    return utils.getParsedPropertyTemplate(customTextTemplate, item as Record<string, string>, userContext);
  }

  private static getManualButtons(buttonsDescription: MessageButtonsDescription, utils: MyBotUtils, userContext: UserContext) {
    const result: InlineKeyboardButton.CallbackButton[][] = [];

    for (const button of buttonsDescription.buttons ?? []) {
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
      let elementId = (
        botProject.blocks
          .map((e) => e.elements)
          .flat(1)
          .filter((e) => e.type === ElementType.CONTENT_TEXT) as ContentTextUIElement[]
      ).find((e) => (e.buttonsDescription.buttons ?? []).some((b) => b.id === buttonId))?.id;


      if (isNil(elementId)) {
        elementId = (
          botProject.blocks
            .map((e) => e.elements)
            .flat(1)
            .filter((e) => e.type === ElementType.LOGIC_EDIT_MESSAGE) as EditMessageUIElement[]
        ).find((e) => (e.editedMessage?.buttonsDescription.buttons ?? []).some((b) => b.id === buttonId))?.id;
      }


      link = botProject.links.find(
        (l) => (l.output as ButtonPortDescription).buttonId === `default-button-${elementId}`
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
        .filter((e) => e.type === ElementType.CONTENT_TEXT) as ContentTextUIElement[]
    ).find((e) => e.id === elementId);

    if (isNil(buttonsElement)) {
      throw new Error("ButtonsElement not found");
    }

    throwIfNil(buttonsElement.buttonsDescription.variableButtonsSource?.variableSource);
    throwIfNil(buttonsElement.buttonsDescription.variableButtonsSource?.answerVariableId);

    const items = ChangeArrayVariableHelper.getArrayValueByPath(buttonsElement.buttonsDescription.variableButtonsSource?.variableSource, userContext, utils);
    const answerVariable = utils.getVariableById(buttonsElement.buttonsDescription.variableButtonsSource?.answerVariableId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userContext.updateVariable(answerVariable.name, items[buttonIndex] as any);

    return defaultButtonLink;
  }
}
