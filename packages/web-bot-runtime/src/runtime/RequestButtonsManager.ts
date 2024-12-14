import {
  WebInputButtonsUIElement,
  ButtonsSourceStrategy,
  BotProject,
  ButtonPortDescription,
  ElementType,
  RequestButtonDescription,
} from '@kickoffbot.com/types';
import { WebUserContext } from './WebUserContext';
import { WebBotRuntimeUtils } from './WebBotRuntimeUtils';
import { isNil } from 'lodash';
import { ChangeArrayVariableHelper } from './ChangeArrayVariableHelper';
import { LogService } from './log/LogService';

export class RequestButtonsManager {
  public static getButtonsForMessage(
    userContext: WebUserContext,
    elementId: string,
    messageButtonsDescription: WebInputButtonsUIElement,
    utils: WebBotRuntimeUtils,
    logService: LogService,
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
        logService,
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
    logService: LogService,
  ) {
    const result: RequestButtonDescription[] = [];

    if (isNil(buttonsDescription.variableButtonsSource?.variableSource)) {
      logService.error('Please specify variable source for buttons generation');
      return [];
    }

    const items = ChangeArrayVariableHelper.getArrayValueByPath(
      buttonsDescription.variableButtonsSource?.variableSource,
      userContext,
      utils,
      logService,
    );

    for (const item of items) {
      if (isNil(buttonsDescription.variableButtonsSource.customTextTemplate)) {
        logService.error('Please specify text template for buttons generation');
        return [];
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
    logService: LogService,
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
      logService.error('Could not find buttons element. Skipping...');
      return null;
    }

    if (isNil(buttonsElement.variableButtonsSource?.variableSource)) {
      logService.error('Could not find variable buttons source. Skipping...');
      return null;
    }

    if (isNil(buttonsElement.variableButtonsSource?.answerVariableId)) {
      logService.error(
        'Could not find variable to save user clicked button. Skipping...',
      );
      return null;
    }

    const items = ChangeArrayVariableHelper.getArrayValueByPath(
      buttonsElement.variableButtonsSource?.variableSource,
      userContext,
      utils,
      logService,
    );
    const answerVariable = utils.getVariableById(
      buttonsElement.variableButtonsSource?.answerVariableId,
    );

    if (isNil(answerVariable)) {
      logService.error(
        'Could not find variable to save user clicked button. Skipping...',
      );
      return defaultButtonLink;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userContext.updateVariable(answerVariable.name, items[buttonIndex] as any);

    return defaultButtonLink;
  }
}
