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
  ChangeObjectVariableWorkflow,
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

export class WebBotRuntime {
  private _utils: WebBotRuntimeUtils;
  private _userContext: WebUserContext;
  private _requestElementConverter: RequestElementConverter;

  constructor(
    private _project: BotProject,
    externalVariables?: Record<string, unknown>,
  ) {
    this._utils = new WebBotRuntimeUtils(_project);
    this._userContext = new WebUserContext(_project, externalVariables);
    this._requestElementConverter = new RequestElementConverter(
      this._utils,
      this._userContext,
    );
  }

  async startBot() {
    const startLink = this._utils.getLinkByBlockId('/start');

    if (isNil(startLink)) {
      return [
        this.getServiceMessageToChat(
          'It looks like your bot is missing a start block! 😊 Please add one to get things going. 😊',
        ),
      ];
    }

    const block = this._utils.getBlockById(startLink.input.blockId);
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

        const request: ChatItemWebRuntime = {
          content: {
            element:
              this._requestElementConverter.getRequestElement(typedElement),
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

    if (shouldHandleNextElement) {
      const newItems = await this.checkNextElement();
      chatItems.push(...newItems);
    }

    return chatItems;
  }

  private handleCardsElement(
    element: WebInputCardsUIElement,
  ): ChatItemWebRuntime {
    const helper = new CardsElementHelper(
      element,
      this._utils,
      this._userContext,
      this._project,
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
    throwIfNil(elementId);

    const typedElement = this._utils.getElementById(elementId) as
      | WebInputTextUIElement
      | WebInputNumberUIElement
      | WebInputPhoneUIElement
      | WebInputEmailUIElement
      | WebInputCardsUIElement
      | WebOpinionScaleUIElement
      | WebRatingUIElement
      | WebInputDateTimeUIElement;

    if (typedElement.type === ElementType.WEB_INPUT_BUTTONS) {
      const localResult = await this.handleUserButtonsResponse(
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
      const variable = this._utils.getVariableById(typedElement.variableId);
      this._userContext.updateVariable(variable.name, value);
    }

    return await this.checkNextElement();
  }

  private async handleUserMultipleChoiceResponse(
    element: WebMultipleChoiceUIElement,
    value: MultipleChoiceOptionDescription[],
  ) {
    const helper = new MultipleChoiceElementHelper(
      element,
      this._utils,
      this._userContext,
    );

    helper.handleUserResponse(value);

    return await this.checkNextElement();
  }

  private async handleUserCardsResponse(
    element: WebInputCardsUIElement,
    value: CardsUserResponse,
  ) {
    const helper = new CardsElementHelper(
      element,
      this._utils,
      this._userContext,
      this._project,
    );

    const link = helper.handleUserResponse(value);

    if (!isNil(link)) {
      const block = this._utils.getBlockById(link.input.blockId);
      const element = block.elements[0];

      throwIfNil(element);

      return await this.handleElement(block, element);
    }

    return await this.checkNextElement();
  }

  public async handleUserButtonsResponse(btn: RequestButtonDescription) {
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
      );
    } else if (buttonsSourceStrategy === ButtonsSourceStrategy.Manual) {
      link = RequestButtonsManager.handleCallbackQueryManual(
        callbackData,
        this._project,
      );
    }

    if (isNil(link)) {
      console.log('Link is empty');
      return;
    }

    const block = this._utils.getBlockById(link.input.blockId);
    const element = block.elements[0];

    throwIfNil(element);

    return await this.handleElement(block, element);
  }

  private handleChangeVariableElement(element: ChangeVariableUIElement) {
    if (!element.selectedVariableId) {
      throw new Error('InvalidOperationError: variable is null');
    }

    const userContext = this._userContext;

    const variable = this._utils.getVariableById(element.selectedVariableId);
    if (element.restoreInitialValue) {
      try {
        userContext.updateVariable(
          variable.name,
          JSON.parse(variable.value as string),
        );
      } catch {
        userContext.updateVariable(variable.name, variable.value as string);
      }
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
        ) as object;
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
    );

    if (conditionIsTrue) {
      const link = this._project.links.find(
        (l) => (l.output as ButtonPortDescription).buttonId === element.id,
      );
      if (isNil(link)) {
        return true;
      }

      const block = this._utils.getBlockById(link.input.blockId);

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
    );

    await helper.handleElement(element);
  }

  private async handleHttpRequestElement(
    element: HTTPRequestIntegrationUIElement,
  ) {
    const parseText = (text: string) => {
      return this._utils.getParsedText(text, this._userContext);
    };

    const instance = new SendReceiveHttpRequest(element, {
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
        this._userContext.updateVariable(variable.name, responseData);
      }
    } catch (err) {
      console.error('handleHttpRequestElement', err);
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
