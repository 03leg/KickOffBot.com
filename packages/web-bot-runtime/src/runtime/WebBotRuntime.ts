/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BotProject,
  ElementType,
  FlowDesignerUIBlockDescription,
  UIElement,
  WebContentTextUIElement,
  ChatItemWebRuntime,
  ChatItemTypeWebRuntime,
  WebInputEmailUIElement,
  WebInputButtonsUIElement,
  WebInputDateTimeUIElement,
  WebInputNumberUIElement,
  WebInputPhoneUIElement,
  WebInputTextUIElement,
  RequestButtonDescription,
  ButtonsSourceStrategy,
  ChangeVariableUIElement,
  ChangeArrayVariableWorkflow,
  ChangeBooleanVariableWorkflow,
  ChangeNumberStringVariableWorkflow,
  VariableType,
  WebLogicRemoveMessagesUIElement,
  ConditionUIElement,
  ButtonPortDescription,
  GoogleSheetsIntegrationUIElement,
  HTTPRequestIntegrationUIElement,
  SendTelegramMessageIntegrationUIElement,
  TelegramConnectionDescription,
  WebInputCardsUIElement,
  CardsUserResponse,
  BotMessageBodyType,
  BotMessageBody,
  WebContentMediaUIElement,
  MediaMessageDescription,
  WebOpinionScaleUIElement,
  WebRatingUIElement,
  WebMultipleChoiceUIElement,
  MultipleChoiceOptionDescription,
  WebLogicBrowserCodeUIElement,
  CodeResultDescription,
  NOW_DATE_TIME_VARIABLE_NAME,
} from '@kickoffbot.com/types';
import { WebBotRuntimeUtils } from './WebBotRuntimeUtils';
import { WebUserContext } from './WebUserContext';
import { v4 } from 'uuid';
import { isNil } from 'lodash';
import { throwIfNil } from 'src/utils/guard';
import { RequestElementConverter } from './RequestElementConverter';
import { RequestButtonsManager } from './RequestButtonsManager';
import { ChangeArrayVariableHelper } from './ChangeArrayVariableHelper';
import { ChangeObjectVariableHelper } from './ChangeObjectVariableHelper';
import { ConditionChecker } from './ConditionChecker';
import { GoogleSpreadsheetHelper } from './GoogleSpreadsheetHelper';
import { SendReceiveHttpRequest } from './SendReceiveHttpRequest';
import { Telegraf } from 'telegraf';
import { CardsElementHelper } from './CardsElementHelper';
import { MediaMessageHelper } from './MediaMessageHelper';
import { MultipleChoiceElementHelper } from './helper/MultipleChoiceElementHelper';
import { ChangeDateTimeVariableHelper } from './helper/ChangeDateTimeVariableHelper';
import { LogService } from './log/LogService';

export class WebBotRuntime {
  private _utils: WebBotRuntimeUtils;
  private _userContext: WebUserContext;
  private _requestElementConverter: RequestElementConverter;
  private _logService: LogService;

  constructor(
    private _project: BotProject,
    logService: LogService,
    externalVariables?: Record<string, unknown>,
  ) {
    this._logService = logService;

    this._logService.debug('Initializing runtime');

    this._utils = new WebBotRuntimeUtils(_project, this._logService);
    this._userContext = new WebUserContext(
      _project,
      this._logService,
      externalVariables,
    );
    this._requestElementConverter = new RequestElementConverter(
      this._utils,
      this._userContext,
      this._logService,
    );

    this._logService.debug('Runtime initialized');
  }

  async startBot() {
    this._logService.debug('Starting bot');
    const startLink = this._utils.getLinkByBlockId('/start');

    if (isNil(startLink)) {
      this._logService.warn('No start block found.');
      return [
        this.getServiceMessageToChat(
          'It looks like your bot is missing a start block! 😊 Please add one to get things going. 😊',
        ),
      ];
    }

    const block = this._utils.getBlockById(startLink.input.blockId);

    if (isNil(block)) {
      this._logService.error('No start block found.');
      return [
        this.getServiceMessageToChat(
          'Could not find start block. Please check your configuration.',
        ),
      ];
    }

    const firstElement = block.elements[0];
    const response = await this.handleElement(block, firstElement);

    return response;
  }

  private getServiceMessageToChat(serviceMessage: string) {
    return {
      content: {
        type: BotMessageBodyType.MessageAndAttachments,
        content: {
          message: serviceMessage,
          attachments: [],
        },
      },
      uiElementId: 'start',
      id: v4(),
      itemType: ChatItemTypeWebRuntime.BOT_MESSAGE,
    };
  }

  private async handleElement(
    block: FlowDesignerUIBlockDescription,
    element: UIElement,
  ) {
    this._logService.logCurrentState(this._userContext);

    this._logService.debug(`<>`, {
      elementPoint: {
        blockId: block.id,
        elementId: element.id,
      },
    });

    let shouldCalcNextStep = true;
    let shouldHandleNextElement = true;

    const chatItems: ChatItemWebRuntime[] = [];

    switch (element.type) {
      case ElementType.WEB_CONTENT_MESSAGE: {
        const typedElement = element as WebContentTextUIElement;

        const messageText = this._utils.getParsedText(
          typedElement.htmlContent ?? '',
          this._userContext,
        );

        this._logService.debug(`Got parsed message.`, {
          botMessage: {
            attachmentsCount: typedElement.attachments.length,
            message: messageText,
          },
        });

        chatItems.push({
          content: {
            type: BotMessageBodyType.MessageAndAttachments,
            content: {
              message: messageText,
              attachments: typedElement.attachments,
            },
          },
          uiElementId: typedElement.id,
          id: v4(),
          itemType: ChatItemTypeWebRuntime.BOT_MESSAGE,
        });

        break;
      }
      case ElementType.WEB_INPUT_PHONE:
      case ElementType.WEB_INPUT_DATE_TIME:
      case ElementType.WEB_INPUT_NUMBER:
      case ElementType.WEB_INPUT_EMAIL:
      case ElementType.WEB_INPUT_BUTTONS:
      case ElementType.WEB_OPINION_SCALE:
      case ElementType.WEB_RATING:
      case ElementType.WEB_MULTIPLE_CHOICE:
      case ElementType.WEB_INPUT_TEXT: {
        const typedElement = element as
          | WebInputTextUIElement
          | WebInputNumberUIElement
          | WebInputPhoneUIElement
          | WebInputEmailUIElement
          | WebInputButtonsUIElement
          | WebOpinionScaleUIElement
          | WebMultipleChoiceUIElement
          | WebInputDateTimeUIElement;

        const requestElement =
          this._requestElementConverter.getRequestElement(typedElement);

        const request: ChatItemWebRuntime = {
          content: {
            element: requestElement,
          },
          uiElementId: typedElement.id,
          id: v4(),
          itemType: ChatItemTypeWebRuntime.BOT_REQUEST,
        };

        chatItems.push(request);

        shouldHandleNextElement = false;

        break;
      }
      case ElementType.LOGIC_CHANGE_VARIABLE: {
        this.handleChangeVariableElement(element as ChangeVariableUIElement);
        break;
      }
      case ElementType.LOGIC_CONDITION: {
        shouldCalcNextStep = this.handleLogicConditionElement(
          element as ConditionUIElement,
        );
        break;
      }
      case ElementType.WEB_LOGIC_BROWSER_CODE: {
        const chatItem = this.handleWebLogicBrowserCodeElement(
          element as WebLogicBrowserCodeUIElement,
        );

        shouldHandleNextElement = false;
        chatItems.push(chatItem);
        break;
      }
      case ElementType.WEB_LOGIC_REMOVE_MESSAGES: {
        const chatItem = this.handleLogicRemoveMessagesElement(
          element as WebLogicRemoveMessagesUIElement,
        );

        chatItems.push(chatItem);
        break;
      }
      case ElementType.INTEGRATION_GOOGLE_SHEETS: {
        await this.handleGoogleSheetsElement(
          element as GoogleSheetsIntegrationUIElement,
        );
        break;
      }
      case ElementType.INTEGRATION_HTTP_REQUEST: {
        await this.handleHttpRequestElement(
          element as HTTPRequestIntegrationUIElement,
        );
        break;
      }
      case ElementType.INTEGRATION_SEND_TELEGRAM_MESSAGE: {
        await this.handleSendTelegramMessageElement(
          element as SendTelegramMessageIntegrationUIElement,
        );
        break;
      }
      case ElementType.WEB_INPUT_CARDS: {
        const typedElement = element as WebInputCardsUIElement;
        const chatItem = this.handleCardsElement(typedElement);
        chatItems.push(chatItem);

        if (
          typedElement.useCardButtons ||
          typedElement.selectableCards ||
          typedElement.useGeneralButtons
        ) {
          shouldHandleNextElement = false;
        }
        break;
      }
      case ElementType.WEB_CONTENT_VIDEOS:
      case ElementType.WEB_CONTENT_IMAGES: {
        const typedElement = element as WebContentMediaUIElement;

        const content: MediaMessageDescription =
          MediaMessageHelper.getMediaMessageContent(
            typedElement,
            this._utils,
            this._userContext,
          );

        chatItems.push({
          content: {
            type: BotMessageBodyType.Media,
            content,
          },
          uiElementId: typedElement.id,
          id: v4(),
          itemType: ChatItemTypeWebRuntime.BOT_MESSAGE,
        });

        break;
      }
      default: {
        throw new Error('NotImplementedError');
      }
    }

    if (shouldCalcNextStep) {
      this.calcNextStep(block, element);
    }

    this._logService.debug(`</>`, {
      elementPoint: {
        blockId: block.id,
        elementId: element.id,
      },
    });

    if (shouldHandleNextElement) {
      const newItems = await this.checkNextElement();
      chatItems.push(...newItems);
    }

    return chatItems;
  }

  private handleWebLogicBrowserCodeElement(
    element: WebLogicBrowserCodeUIElement,
  ): ChatItemWebRuntime {
    const getRequestedVariables = () => {
      const result: Record<string, unknown> = {};
      for (const variableId of element.requiredVariableIds) {
        const variable = this._utils.getVariableById(variableId);

        if (isNil(variable)) {
          this._logService.error('Could not find variable to send to browser');
          continue;
        }

        let value = this._userContext.getVariableValueByName(variable.name);
        if (variable.name === NOW_DATE_TIME_VARIABLE_NAME) {
          value = new Date().toISOString();
        }

        result[variable.name] = value;
      }

      return result;
    };

    const result: ChatItemWebRuntime = {
      id: v4(),
      itemType: ChatItemTypeWebRuntime.CLIENT_CODE,
      content: {
        code: element.code,
        requestedVariables: getRequestedVariables(),
      },
      uiElementId: element.id,
    };

    return result;
  }

  private handleCardsElement(
    element: WebInputCardsUIElement,
  ): ChatItemWebRuntime {
    const helper = new CardsElementHelper(
      element,
      this._utils,
      this._userContext,
      this._project,
      this._logService,
    );

    const requestElement = helper.getRequestElement();

    let chatItem: ChatItemWebRuntime;

    if (
      element.useCardButtons ||
      element.selectableCards ||
      element.useGeneralButtons
    ) {
      chatItem = {
        content: {
          element: requestElement,
        },
        uiElementId: element.id,
        id: v4(),
        itemType: ChatItemTypeWebRuntime.BOT_REQUEST,
      };
    } else {
      chatItem = {
        content: {
          content: requestElement,
          type: BotMessageBodyType.Cards,
        } as BotMessageBody,
        uiElementId: element.id,
        id: v4(),
        itemType: ChatItemTypeWebRuntime.BOT_MESSAGE,
      };
    }

    return chatItem;
  }

  private async checkNextElement() {
    const nextStep = this._userContext.nextStep;
    let result: ChatItemWebRuntime[] = [];

    if (isNil(nextStep)) {
      return result;
    }

    const block = this._project.blocks.find((b) => b.id === nextStep?.blockId);

    if (isNil(block)) {
      return result;
    }

    const nextElement = block.elements.find((e) => e.id === nextStep.elementId);

    if (isNil(nextElement)) {
      return result;
    }

    switch (nextElement.type) {
      case ElementType.LOGIC_CONDITION:
      case ElementType.LOGIC_CHANGE_VARIABLE:
      case ElementType.LOGIC_EDIT_MESSAGE:
      case ElementType.LOGIC_REMOVE_MESSAGE:
      case ElementType.INTEGRATION_SEND_TELEGRAM_MESSAGE:
      case ElementType.INTEGRATION_GOOGLE_SHEETS:
      case ElementType.INTEGRATION_HTTP_REQUEST:
      case ElementType.WEB_INPUT_TEXT:
      case ElementType.WEB_INPUT_NUMBER:
      case ElementType.WEB_INPUT_DATE_TIME:
      case ElementType.WEB_INPUT_PHONE:
      case ElementType.WEB_INPUT_EMAIL:
      case ElementType.WEB_INPUT_BUTTONS:
      case ElementType.WEB_LOGIC_REMOVE_MESSAGES:
      case ElementType.WEB_INPUT_CARDS:
      case ElementType.WEB_CONTENT_IMAGES:
      case ElementType.WEB_CONTENT_VIDEOS:
      case ElementType.WEB_OPINION_SCALE:
      case ElementType.WEB_RATING:
      case ElementType.WEB_MULTIPLE_CHOICE:
      case ElementType.WEB_LOGIC_BROWSER_CODE:
      case ElementType.WEB_CONTENT_MESSAGE: {
        result = await this.handleElement(block, nextElement);
        break;
      }
    }

    return result;
  }

  private calcNextStep(
    currentBlock: FlowDesignerUIBlockDescription,
    currentElement: UIElement,
  ) {
    let nextBlock: FlowDesignerUIBlockDescription | null = null;
    let nextElement: UIElement | null = null;

    if (
      currentBlock.elements[currentBlock.elements.length - 1] === currentElement
    ) {
      const link = this._utils.getLinkFromBlock(currentBlock);
      if (!isNil(link)) {
        nextBlock =
          this._project.blocks.find((b) => b.id === link.input.blockId) ?? null;
        if (!isNil(nextBlock) && nextBlock.elements.length >= 1) {
          nextElement = nextBlock.elements[0] ?? null;
        }
      }
    } else {
      nextBlock = currentBlock;
      nextElement =
        currentBlock.elements[
          currentBlock.elements.indexOf(currentElement) + 1
        ] ?? null;
    }

    if (isNil(nextBlock) || isNil(nextElement)) {
      this._userContext.setNextStep(null);
    } else {
      this._userContext.setNextStep({
        blockId: nextBlock.id,
        elementId: nextElement.id,
      });
    }
  }

  public async handleUserResponse(elementId: string, value: unknown) {
    this._logService.logCurrentState(this._userContext);

    const typedElement = this._utils.getElementById(elementId) as
      | WebInputTextUIElement
      | WebInputNumberUIElement
      | WebInputPhoneUIElement
      | WebInputEmailUIElement
      | WebInputCardsUIElement
      | WebOpinionScaleUIElement
      | WebRatingUIElement
      // todo: fix this
      // | WebLogicBrowserCodeUIElement
      | WebInputDateTimeUIElement;

    if (isNil(typedElement)) {
      this._logService.error(
        'Could not find element by id. Please check your configuration',
      );
      return;
    }

    this._logService.logUserInput(typedElement.type, value);

    if (typedElement.type === ElementType.WEB_LOGIC_BROWSER_CODE) {
      await this.handleUserBrowserCodeResponse(
        typedElement as WebLogicBrowserCodeUIElement,
        value as CodeResultDescription,
      );
      return await this.checkNextElement();
    }

    if (typedElement.type === ElementType.WEB_INPUT_BUTTONS) {
      const localResult = await this.handleUserButtonsResponse(
        typedElement.id,
        value as RequestButtonDescription,
      );

      if (localResult) {
        return localResult;
      }

      return await this.checkNextElement();
    }

    if (typedElement.type === ElementType.WEB_INPUT_CARDS) {
      return await this.handleUserCardsResponse(
        typedElement as WebInputCardsUIElement,
        value as CardsUserResponse,
      );
    }

    if (typedElement.type === ElementType.WEB_MULTIPLE_CHOICE) {
      return await this.handleUserMultipleChoiceResponse(
        typedElement as WebMultipleChoiceUIElement,
        value as MultipleChoiceOptionDescription[],
      );
    }

    if (typedElement.variableId) {
      this._logService.logStartPointById(typedElement.id);

      const variable = this._utils.getVariableById(typedElement.variableId);

      if (isNil(variable)) {
        this._logService.error('Could not find variable to update. Skipping.');
        return;
      }

      this._userContext.updateVariable(variable.name, value);

      this._logService.logFinishPointById(typedElement.id);
    }

    return await this.checkNextElement();
  }

  private handleUserBrowserCodeResponse(
    typedElement: WebLogicBrowserCodeUIElement,
    result: CodeResultDescription,
  ) {
    this._logService.logStartPointById(typedElement.id);

    if (
      isNil(result.updatedVariables) ||
      typeof result.updatedVariables !== 'object' ||
      Object.keys(result.updatedVariables).length === 0
    ) {
      this._logService.warn(`No variables were updated`);
      return;
    }

    const modifiedVariableNames = typedElement.modifiedVariableIds.map(
      (v) => this._utils.getVariableById(v)?.name ?? '',
    );

    for (const [key, value] of Object.entries(result.updatedVariables)) {
      if (!modifiedVariableNames.includes(key)) {
        this._logService.warn(
          `Variable with name '${key}' not found for update`,
        );
        continue;
      }

      this._userContext.updateVariable(key, value);
    }

    this._logService.logFinishPointById(typedElement.id);
  }

  private async handleUserMultipleChoiceResponse(
    element: WebMultipleChoiceUIElement,
    value: MultipleChoiceOptionDescription[],
  ) {
    this._logService.logStartPointById(element.id);
    const helper = new MultipleChoiceElementHelper(
      element,
      this._utils,
      this._userContext,
      this._logService,
    );

    helper.handleUserResponse(value);

    this._logService.logFinishPointById(element.id);
    return await this.checkNextElement();
  }

  private async handleUserCardsResponse(
    element: WebInputCardsUIElement,
    value: CardsUserResponse,
  ) {
    this._logService.logStartPointById(element.id);
    const helper = new CardsElementHelper(
      element,
      this._utils,
      this._userContext,
      this._project,
      this._logService,
    );

    const link = helper.handleUserResponse(value);

    if (!isNil(link)) {
      const block = this._utils.getBlockById(link.input.blockId);
      if (isNil(block)) {
        this._logService.error('Could not find block by link. Skipping...');
        return;
      }
      const nextElement = block.elements[0];

      if (isNil(nextElement)) {
        this._logService.error(
          'Could not find next element by link. Skipping.',
        );
        return;
      }

      this._logService.logFinishPointById(element.id);

      return await this.handleElement(block, nextElement);
    }

    this._logService.logFinishPointById(element.id);

    return await this.checkNextElement();
  }

  public async handleUserButtonsResponse(
    elementId: string,
    btn: RequestButtonDescription,
  ) {
    this._logService.logStartPointById(elementId);
    const callbackData = btn.id;

    const buttonsSourceStrategy =
      RequestButtonsManager.getButtonsSourceStrategy(callbackData);
    let link;

    if (buttonsSourceStrategy === ButtonsSourceStrategy.FromVariable) {
      link = RequestButtonsManager.handleCallbackQueryFromVariable(
        callbackData,
        this._project,
        this._userContext,
        this._utils,
        this._logService,
      );
    } else if (buttonsSourceStrategy === ButtonsSourceStrategy.Manual) {
      link = RequestButtonsManager.handleCallbackQueryManual(
        callbackData,
        this._project,
      );
    }

    if (isNil(link)) {
      this._logService.warn(
        `No link found for the clicked button. Skipping...`,
      );
      this._logService.logFinishPointById(elementId);
      return;
    }

    const block = this._utils.getBlockById(link.input.blockId);
    if (isNil(block)) {
      this._logService.error('Could not find block by link. Skipping...');
      return;
    }
    const element = block.elements[0];

    throwIfNil(element);

    this._logService.debug('Found next element to process by link');
    this._logService.logFinishPointById(elementId);

    return await this.handleElement(block, element);
  }

  private handleChangeVariableElement(element: ChangeVariableUIElement) {
    if (!element.selectedVariableId) {
      this._logService.error(
        'No selected variable in change variable element. You need to select variable to change or remove useless element.',
      );
      return;
    }

    const userContext = this._userContext;

    const variable = this._utils.getVariableById(element.selectedVariableId);

    if (isNil(variable)) {
      this._logService.error('Could not find variable to update. Skipping.');
      return;
    }

    if (element.restoreInitialValue) {
      try {
        userContext.updateVariable(
          variable.name,
          JSON.parse(variable.value as string),
        );
      } catch {
        userContext.updateVariable(variable.name, variable.value as string);
      }
      this._logService.debug(
        `Restored initial value of variable with name: ${variable.name}`,
      );
      return;
    }

    let newValue: number | string | null | boolean | object | unknown[] = null;

    switch (variable.type) {
      case VariableType.NUMBER: {
        if (isNil(element.workflowDescription)) {
          break;
        }

        const expression = (
          element.workflowDescription as ChangeNumberStringVariableWorkflow
        ).expression;

        newValue = this._utils.getNumberValueFromExpression(
          expression,
          userContext,
        );

        break;
      }
      case VariableType.STRING: {
        if (isNil(element.workflowDescription)) {
          break;
        }

        const expression = (
          element.workflowDescription as ChangeNumberStringVariableWorkflow
        ).expression;

        newValue = this._utils.getStringValueFromExpression(
          expression,
          userContext,
        );

        break;
      }
      case VariableType.BOOLEAN: {
        if (isNil(element.workflowDescription)) {
          break;
        }

        const workflowDescription =
          element.workflowDescription as ChangeBooleanVariableWorkflow;

        newValue = this._utils.getBooleanValue(
          workflowDescription.strategy,
          variable,
          userContext,
        );
        break;
      }
      case VariableType.ARRAY: {
        if (isNil(element.workflowDescription)) {
          break;
        }

        const workflowDescription =
          element.workflowDescription as ChangeArrayVariableWorkflow;

        newValue = ChangeArrayVariableHelper.getArrayValue(
          workflowDescription,
          variable,
          userContext,
          this._utils,
          this._logService,
        );

        break;
      }

      case VariableType.OBJECT: {
        if (isNil(element.workflowDescription)) {
          break;
        }

        newValue = ChangeObjectVariableHelper.getObjectValue(
          element,
          userContext,
          this._utils,
          this._logService,
        ) as object;
        break;
      }

      case VariableType.DATE_TIME: {
        if (isNil(element.workflowDescription)) {
          break;
        }

        newValue = ChangeDateTimeVariableHelper.getDateTimeValue(
          element,
          userContext,
          this._utils,
          this._logService,
        );

        break;
      }

      default: {
        throw new Error('NotImplementedError. Unknown variable type.');
      }
    }

    if (!isNil(newValue)) {
      userContext.updateVariable(variable.name, newValue);
    }
  }

  private handleLogicRemoveMessagesElement(
    element: WebLogicRemoveMessagesUIElement,
  ) {
    const result: ChatItemWebRuntime = {
      id: v4(),
      itemType: ChatItemTypeWebRuntime.DELETE_MESSAGES,
      content: {
        elementIds: element.messageIds,
        deleteAllMessages: element.removeAllMessages,
      },
      uiElementId: element.id,
    };

    return result;
  }

  private handleLogicConditionElement(element: ConditionUIElement): boolean {
    const conditionIsTrue = ConditionChecker.check(
      element,
      this._utils,
      this._userContext,
      this._logService,
    );

    if (conditionIsTrue) {
      const link = this._project.links.find(
        (l) => (l.output as ButtonPortDescription).buttonId === element.id,
      );
      if (isNil(link)) {
        return true;
      }

      const block = this._utils.getBlockById(link.input.blockId);

      if (isNil(block)) {
        this._logService.error(
          'Could not find block by link to continue. Skipping.',
        );
      }

      this._userContext.setNextStep({
        blockId: block.id,
        elementId: block.elements[0]!.id,
      });

      return false;
    }

    return true;
  }

  private async handleGoogleSheetsElement(
    element: GoogleSheetsIntegrationUIElement,
  ) {
    const helper = new GoogleSpreadsheetHelper(
      this._project,
      this._userContext,
      this._utils,
      this._logService,
    );

    await helper.handleElement(element);
  }

  private async handleHttpRequestElement(
    element: HTTPRequestIntegrationUIElement,
  ) {
    const parseText = (text: string) => {
      return this._utils.getParsedText(text, this._userContext);
    };

    const instance = new SendReceiveHttpRequest(element, this._logService, {
      parse: parseText,
    });

    try {
      await instance.send();

      if (!isNil(element.responseDataVariableId) && element.saveResponseData) {
        let responseData = instance.lastResponseData;
        try {
          responseData = JSON.parse(responseData);
        } catch (err) {}

        const variable = this._utils.getVariableById(
          element.responseDataVariableId,
        );
        if (isNil(variable)) {
          this._logService.error(
            'Could not find variable to update. Skipping.',
          );
          return;
        }
        this._userContext.updateVariable(variable.name, responseData);
      }
    } catch (err) {
      this._logService.realError('Failed to send request', err);
    }
  }

  private async handleSendTelegramMessageElement(
    element: SendTelegramMessageIntegrationUIElement,
  ) {
    if (isNil(element.connectionId)) {
      return;
    }

    const connection = this._project.connections.find(
      (c) => c.id === element.connectionId,
    ) as TelegramConnectionDescription;
    if (isNil(connection) || !connection.botToken || !connection.targetChatId) {
      return;
    }
    try {
      const bot = new Telegraf(connection.botToken);

      await bot.telegram.sendMessage(
        connection.targetChatId,
        this._utils.getParsedText(
          element.telegramContent ?? '',
          this._userContext,
        ),
        {
          parse_mode: 'HTML',
        },
      );
    } catch (e) {
      console.log('handleSendTelegramMessageElement', e);
    }
  }
}
