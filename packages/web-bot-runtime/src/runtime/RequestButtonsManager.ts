import {
  WebInputButtonsUIElement,
  ButtonsSourceStrategy,
  BotProject,
  ButtonPortDescription,
  ElementType,
  RequestButtonDescription,
} from '@kickoffbot.com/types';
import { throwIfNil } from 'src/utils/guard';
import { WebUserContext } from './WebUserContext';
import { WebBotRuntimeUtils } from './WebBotRuntimeUtils';
import { isNil } from 'lodash';
import { ChangeArrayVariableHelper } from './ChangeArrayVariableHelper';

export class RequestButtonsManager {
  public static getButtonsForMessage(
    userContext: WebUserContext,
    elementId: string,
    messageButtonsDescription: WebInputButtonsUIElement,
    utils: WebBotRuntimeUtils,
  ): RequestButtonDescription[] | null {
    let result: RequestButtonDescription[] = [];

    if (messageButtonsDescription.strategy === ButtonsSourceStrategy.Manual) {
      result = this.getManualButtons(
        messageButtonsDescription,
        utils,
        userContext,
      );
    } else if (
      messageButtonsDescription.strategy === ButtonsSourceStrategy.FromVariable
    ) {
      result = this.getButtonsFromVariable(
        elementId,
        messageButtonsDescription,
        utils,
        userContext,
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
    utils: WebBotRuntimeUtils,
    userContext: WebUserContext,
  ) {
    const result: RequestButtonDescription[] = [];

    if (isNil(buttonsDescription.variableButtonsSource?.variableSource)) {
      throw new Error('InvalidOperationError: variableSource is null');
    }

    const items = ChangeArrayVariableHelper.getArrayValueByPath(
      buttonsDescription.variableButtonsSource?.variableSource,
      userContext,
      utils,
    );

    for (const item of items) {
      if (isNil(buttonsDescription.variableButtonsSource.customTextTemplate)) {
        throw new Error('InvalidOperationError: customTextTemplate is null');
      }

      result.push({
        id: `v_${elementId}_${items.indexOf(item)}`,
        content: this.getButtonText(
          item,
          buttonsDescription.variableButtonsSource.customTextTemplate,
          utils,
          userContext,
        ),
      });
    }

    return result;
  }

  private static getButtonText(
    item: unknown,
    customTextTemplate: string,
    utils: WebBotRuntimeUtils,
    userContext: WebUserContext,
  ) {
    return utils.getParsedPropertyTemplate(
      customTextTemplate,
      item as Record<string, string>,
      userContext,
    );
  }

  private static getManualButtons(
    buttonsDescription: WebInputButtonsUIElement,
    utils: WebBotRuntimeUtils,
    userContext: WebUserContext,
  ) {
    const result: RequestButtonDescription[] = [];

    for (const button of buttonsDescription.buttons ?? []) {
      const buttonContent = utils.getParsedText(button.content, userContext);

      result.push({ id: `m_${button.id}`, content: buttonContent });
    }

    return result;
  }

  public static getButtonsSourceStrategy(callbackData: string) {
    if (callbackData.split('_')[0] === 'm') {
      return ButtonsSourceStrategy.Manual;
    } else if (callbackData.split('_')[0] === 'v') {
      return ButtonsSourceStrategy.FromVariable;
    } else {
      throw new Error(
        'InvalidOperationError: callbackData is invalid: ' + callbackData,
      );
    }
  }

  public static handleCallbackQueryManual(
    callbackData: string,
    botProject: BotProject,
  ) {
    const buttonId = callbackData.split('_')[1];
    let link = botProject.links.find(
      (l) => (l.output as ButtonPortDescription).buttonId === buttonId,
    );

    if (isNil(link)) {
      const elementId = (
        botProject.blocks
          .map((e) => e.elements)
          .flat(1)
          .filter(
            (e) => e.type === ElementType.WEB_INPUT_BUTTONS,
          ) as WebInputButtonsUIElement[]
      ).find((e) => (e.buttons ?? []).some((b) => b.id === buttonId))?.id;

      link = botProject.links.find(
        (l) =>
          (l.output as ButtonPortDescription).buttonId ===
          `default-button-${elementId}`,
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
    utils: WebBotRuntimeUtils,
  ) {
    const callbackDataArray = callbackData.split('_');
    const elementId = callbackDataArray[1];
    const buttonIndex = Number(callbackDataArray[2]);

    const defaultButtonLink = botProject.links.find(
      (l) =>
        (l.output as ButtonPortDescription).buttonId ===
        `default-button-${elementId ?? ''}`,
    );

    const buttonsElement = (
      botProject.blocks
        .map((e) => e.elements)
        .flat(1)
        .filter(
          (e) => e.type === ElementType.WEB_INPUT_BUTTONS,
        ) as WebInputButtonsUIElement[]
    ).find((e) => e.id === elementId);

    if (isNil(buttonsElement)) {
      throw new Error('ButtonsElement not found');
    }

    // TODO: When variable to save answer is not set we have runtime error here
    throwIfNil(buttonsElement.variableButtonsSource?.variableSource);
    throwIfNil(buttonsElement.variableButtonsSource?.answerVariableId);

    const items = ChangeArrayVariableHelper.getArrayValueByPath(
      buttonsElement.variableButtonsSource?.variableSource,
      userContext,
      utils,
    );
    const answerVariable = utils.getVariableById(
      buttonsElement.variableButtonsSource?.answerVariableId,
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userContext.updateVariable(answerVariable.name, items[buttonIndex] as any);

    return defaultButtonLink;
  }
}
