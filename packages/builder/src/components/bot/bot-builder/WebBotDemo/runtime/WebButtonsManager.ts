import {
  BotProject,
  ButtonPortDescription,
  ButtonsSourceStrategy,
  ContentTextUIElement,
  EditMessageUIElement,
  ElementType,
  WebInputButtonsUIElement,
} from "@kickoffbot.com/types";
import { WebUserContext } from "./WebUserContext";
import { isNil } from "lodash";
import { throwIfNil } from "~/utils/guard";
import { WebBotManagerUtils } from "./WebBotManager.utils";
import { ChangeArrayVariableHelper } from "./ChangeArrayVariableHelper";

export interface WebButtonDescription {
  text: string;
  callback_data: string;
}

export class WebButtonsManager {
  public static getButtonsForMessage(
    userContext: WebUserContext,
    elementId: string,
    messageButtonsDescription: WebInputButtonsUIElement,
    utils: WebBotManagerUtils
  ): WebButtonDescription[] | null {
    let result: WebButtonDescription[] = [];

    if (messageButtonsDescription.strategy === ButtonsSourceStrategy.Manual) {
      result = this.getManualButtons(
        messageButtonsDescription,
        utils,
        userContext
      );
    } else if (
      messageButtonsDescription.strategy === ButtonsSourceStrategy.FromVariable
    ) {
      result = this.getButtonsFromVariable(
        elementId,
        messageButtonsDescription,
        utils,
        userContext
      );
    }

    if (result.length === 0) {
      return null;
    }

    return result;
  }

  private static getButtonsFromVariable(
    elementId: string,
    buttonsDescription: WebInputButtonsUIElement,
    utils: WebBotManagerUtils,
    userContext: WebUserContext
  ) {
    const result: WebButtonDescription[] = [];

    if (isNil(buttonsDescription.variableButtonsSource?.variableSource)) {
      throw new Error("InvalidOperationError: variableSource is null");
    }

    const items = ChangeArrayVariableHelper.getArrayValueByPath(
      buttonsDescription.variableButtonsSource?.variableSource,
      userContext,
      utils
    );

    for (const item of items) {
      if (isNil(buttonsDescription.variableButtonsSource.customTextTemplate)) {
        throw new Error("InvalidOperationError: customTextTemplate is null");
      }

      result.push({
        callback_data: `v_${elementId}_${items.indexOf(item)}`,
        text: this.getButtonText(
          item,
          buttonsDescription.variableButtonsSource.customTextTemplate,
          utils,
          userContext
        ),
      });
    }

    return result;
  }

  private static getButtonText(
    item: unknown,
    customTextTemplate: string,
    utils: WebBotManagerUtils,
    userContext: WebUserContext
  ) {
    return utils.getParsedPropertyTemplate(
      customTextTemplate,
      item as Record<string, string>,
      userContext
    );
  }

  private static getManualButtons(
    buttonsDescription: WebInputButtonsUIElement,
    utils: WebBotManagerUtils,
    userContext: WebUserContext
  ) {
    const result: WebButtonDescription[] = [];

    for (const button of buttonsDescription.buttons ?? []) {
      const buttonContent = utils.getParsedText(button.content, userContext);

      result.push({ callback_data: `m_${button.id}`, text: buttonContent });
    }

    return result;
  }

  public static getButtonsSourceStrategy(callbackData: string) {
    if (callbackData.split("_")[0] === "m") {
      return ButtonsSourceStrategy.Manual;
    } else if (callbackData.split("_")[0] === "v") {
      return ButtonsSourceStrategy.FromVariable;
    } else {
      throw new Error(
        "InvalidOperationError: callbackData is invalid: " + callbackData
      );
    }
  }

  public static handleCallbackQueryManual(
    callbackData: string,
    botProject: BotProject
  ) {
    const buttonId = callbackData.split("_")[1];
    let link = botProject.links.find(
      (l) => (l.output as ButtonPortDescription).buttonId === buttonId
    );

    if (isNil(link)) {
      const elementId = (
        botProject.blocks
          .map((e) => e.elements)
          .flat(1)
          .filter(
            (e) => e.type === ElementType.WEB_INPUT_BUTTONS
          ) as WebInputButtonsUIElement[]
      ).find((e) =>
        (e.buttons ?? []).some((b) => b.id === buttonId)
      )?.id;

      link = botProject.links.find(
        (l) =>
          (l.output as ButtonPortDescription).buttonId ===
          `default-button-${elementId}`
      );

      if (isNil(link)) {
        return null;
      }
    }

    return link;
  }

  public static handleCallbackQueryFromVariable(
    callbackData: string,
    botProject: BotProject,
    userContext: WebUserContext,
    utils: WebBotManagerUtils
  ) {
    const callbackDataArray = callbackData.split("_");
    const elementId = callbackDataArray[1];
    const buttonIndex = Number(callbackDataArray[2]);

    const defaultButtonLink = botProject.links.find(
      (l) =>
        (l.output as ButtonPortDescription).buttonId ===
        `default-button-${elementId ?? ""}`
    );

    const buttonsElement = (
      botProject.blocks
        .map((e) => e.elements)
        .flat(1)
        .filter(
          (e) => e.type === ElementType.WEB_INPUT_BUTTONS
        ) as WebInputButtonsUIElement[]
    ).find((e) => e.id === elementId);

    if (isNil(buttonsElement)) {
      throw new Error("ButtonsElement not found");
    }

    throwIfNil(
      buttonsElement.variableButtonsSource?.variableSource
    );
    throwIfNil(
      buttonsElement.variableButtonsSource?.answerVariableId
    );

    const items = ChangeArrayVariableHelper.getArrayValueByPath(
      buttonsElement.variableButtonsSource?.variableSource,
      userContext,
      utils
    );
    const answerVariable = utils.getVariableById(
      buttonsElement.variableButtonsSource?.answerVariableId
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userContext.updateVariable(answerVariable.name, items[buttonIndex] as any);

    return defaultButtonLink;
  }
}
