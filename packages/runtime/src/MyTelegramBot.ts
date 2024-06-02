import { Update, Message, InputMediaPhoto, InputMediaVideo, InputMediaDocument, InputFile } from "telegraf/typings/core/types/typegram";
import { Context, NarrowedContext, Telegraf } from "telegraf";
import { UserContext } from "./UserContext";
import { isNil } from "lodash";
import { getUserContextKey } from "./utils";
import { MyBotUtils } from "./MyBotUtils";
import {
  BotProject,
  ButtonPortDescription,
  ButtonsSourceStrategy,
  ChangeArrayVariableWorkflow,
  ChangeBooleanVariableWorkflow,
  ChangeNumberStringVariableWorkflow,
  ChangeObjectVariableWorkflow,
  ChangeVariableUIElement,
  CommandDescription,
  ConditionUIElement,
  ContentTextUIElement,
  ContentType,
  EditMessageUIElement,
  ElementType,
  FlowDesignerUIBlockDescription,
  InputTextUIElement,
  RemoveMessageUIElement,
  SendTelegramMessageIntegrationUIElement,
  TelegramConnectionDescription,
  UIElement,
  VariableType,
} from "@kickoffbot.com/types";
import { MediaGroup } from "telegraf/typings/telegram-types";
import { ConditionChecker } from "./ConditionChecker";
import { ChangeArrayVariableHelper } from "./ChangeArrayVariableHelper";
import { ChangeObjectVariableHelper } from "./ChangeObjectVariableHelper";
import { MessageButtonsManager } from "./MessageButtonsManager";
import { MessagesStore } from "./MessagesStore";

export class MyTelegramBot {
  private _bot: Telegraf;
  private _botProject: BotProject;
  private _state = new Map<number, UserContext>();
  private _utils = new MyBotUtils();
  private _messageStore = new MessagesStore();

  constructor(token: string, botProject: BotProject) {
    this._bot = new Telegraf(token);
    this._botProject = botProject;
    this._utils.setProject(this._botProject);
  }

  private setupCommands() {
    // void this._bot.telegram.setMyCommands([
    //   {
    //     command: "greetings",
    //     description: "Start bot",
    //   }
    // ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commands: CommandDescription[] = (this._botProject.blocks.find((b) => b.id === "/start")?.elements[0] as any).commands ?? [];
    for (const command of commands) {
      const realCommand = command.command.slice(1);
      this._bot.command(realCommand, this.handleCommand.bind(this, command));
    }
  }

  async setup() {
    this._bot.start(this.handleStart.bind(this));

    this.setupCommands();

    this._bot.on("message", this.handleMessage.bind(this));
    // this._bot.on("inline_query", () => {
    //   console.log("inline_query");
    // });
    this._bot.on("callback_query", this.handleCallbackQuery.bind(this));
    // this._bot.on("chosen_inline_result", () => {
    //   console.log("chosen_inline_result");
    // });
    await this._bot.launch();
  }

  private async handleCommand(command: CommandDescription, context: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>) {
    try {
      const userContext = this._state.get(getUserContextKey(context));
      if (isNil(userContext)) {
        throw new Error("InvalidOperationError: userContext is null");
      }

      const commandId = command.id;

      const commandLink = this._utils.getLinkForButton("/start", commandId);
      const block = this._utils.getBlockById(commandLink.input.blockId);

      await this.handleElement(userContext, context, block, block.elements[0]);
      this.calcNextStep(userContext, block, block.elements[0]);
    } catch (e) {
      console.log("handleCommand", e);
    }
  }

  private async handleStart(context: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>) {
    console.log("start");
    const userContext = new UserContext(this._botProject);
    userContext.updateTelegramVariableBasedOnMessage(context);

    const startLink = this._utils.getLinkByBlockId("/start");
    const block = this._utils.getBlockById(startLink.input.blockId);

    await this.handleElement(userContext, context, block, block.elements[0]);

    this.calcNextStep(userContext, block, block.elements[0]);

    this._state.set(getUserContextKey(context), userContext);
  }

  private calcNextStep(userContext: UserContext, currentBlock: FlowDesignerUIBlockDescription, currentElement: UIElement) {
    let nextBlock: FlowDesignerUIBlockDescription | null = null;
    let nextElement: UIElement | null = null;

    if (currentBlock.elements[currentBlock.elements.length - 1] === currentElement) {
      const link = this._utils.getLinkFromBlock(currentBlock);
      if (!isNil(link)) {
        nextBlock = this._botProject.blocks.find((b) => b.id === link.input.blockId) ?? null;
        if (!isNil(nextBlock) && nextBlock.elements.length >= 1) {
          nextElement = nextBlock.elements[0];
        }
      }
    } else {
      nextBlock = currentBlock;
      nextElement = currentBlock.elements[currentBlock.elements.indexOf(currentElement) + 1];
    }

    if (isNil(nextBlock) || isNil(nextElement)) {
      userContext.setNextStep(null);
    } else {
      userContext.setNextStep({
        blockId: nextBlock.id,
        elementId: nextElement.id,
      });
    }
  }

  private async handleCallbackQuery(context: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>) {
    try {
      const userContext = this._state.get(getUserContextKey(context));
      if (isNil(userContext)) {
        throw new Error("InvalidOperationError: userContext is null");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const callbackData = (context.callbackQuery as any).data;

      const buttonsSourceStrategy = MessageButtonsManager.getButtonsSourceStrategy(callbackData);
      let link;

      if (buttonsSourceStrategy === ButtonsSourceStrategy.FromVariable) {
        link = MessageButtonsManager.handleCallbackQueryFromVariable(callbackData, this._botProject, userContext, this._utils);
      } else if (buttonsSourceStrategy === ButtonsSourceStrategy.Manual) {
        link = MessageButtonsManager.handleCallbackQueryManual(callbackData, this._botProject);
      }

      if (isNil(link)) {
        await context.answerCbQuery("Link is empty!");
        return;
      }

      const block = this._utils.getBlockById(link.input.blockId);
      const element = block.elements[0];

      await this.handleElement(userContext, context, block, element);
      void context.answerCbQuery();
    } catch (e) {
      console.log("handleCallbackQuery", e);
    }
  }

  private async handleMessage(context: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>) {
    try {
      const userContext = this._state.get(getUserContextKey(context));
      if (isNil(userContext)) {
        throw new Error("InvalidOperationError: userContext is null");
      }
      const nextStep = userContext.nextStep;
      if (isNil(nextStep)) {
        return;
      }

      const block = this._utils.getBlockById(nextStep.blockId);
      const element = this._utils.getElementById(block.elements, nextStep.elementId);

      await this.handleElement(userContext, context, block, element);
    } catch (e) {
      console.log("handleMessage", e);
    }
  }

  private async handleElement(
    userContext: UserContext,
    context: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>,
    block: FlowDesignerUIBlockDescription,
    element: UIElement,
  ) {
    let shouldCalcNextStep = true;

    switch (element.type) {
      case ElementType.CONTENT_TEXT: {
        const contentTextElement = element as ContentTextUIElement;
        if (isNil(contentTextElement.telegramContent)) {
          throw new Error("InvalidOperationError: telegramContent is null");
        }

        const answerText = this._utils.getParsedText(contentTextElement.telegramContent, userContext);

        const messageButtons = MessageButtonsManager.getButtonsForMessage(
          userContext,
          contentTextElement.id,
          contentTextElement,
          this._utils,
        );

        const sendPlainMessage = async (serviceMessage?: string) => {
          const sendResult = await context.sendMessage(answerText + (!isNil(serviceMessage) ? "<br/>" + serviceMessage : ""), {
            parse_mode: "HTML",
            reply_markup: !isNil(messageButtons)
              ? {
                  inline_keyboard: messageButtons,
                }
              : undefined,
          });

          this._messageStore.saveMessageSendResult(contentTextElement.id, sendResult);
        };

        if (!isNil(contentTextElement.attachments) && contentTextElement.attachments.length > 0) {
          if (contentTextElement.attachments.length === 1) {
            const attachment = contentTextElement.attachments[0];
            const request = {
              caption: answerText,
              parse_mode: "HTML",
              reply_markup: !isNil(messageButtons)
                ? {
                    inline_keyboard: messageButtons,
                  }
                : undefined,
            } as const;

            if (attachment.typeContent === ContentType.Image) {
              if (attachment.name.endsWith(".gif")) {
                await context.sendAnimation(attachment.url, request);
              } else {
                await context.sendPhoto(attachment.url, request);
              }
            } else {
              const inputFile: InputFile = {
                url: attachment.url,
                filename: attachment.name,
              };

              await context.sendDocument(inputFile, request);
            }
          } else {
            let request: MediaGroup = [];
            if (contentTextElement.attachments.every((a) => a.typeContent === ContentType.Image)) {
              const images = [] as (InputMediaPhoto | InputMediaVideo)[];
              for (const item of contentTextElement.attachments) {
                const isFirstPhoto = contentTextElement.attachments[0] === item;
                images.push({
                  media: item.url,
                  type: "photo",
                  caption: isFirstPhoto ? answerText : undefined,
                  parse_mode: "HTML",
                });
              }

              request = images;
            } else {
              const documents = [] as InputMediaDocument[];
              for (const item of contentTextElement.attachments) {
                const isLastDocument = contentTextElement.attachments[contentTextElement.attachments.length - 1] === item;

                documents.push({
                  media: {
                    url: item.url,
                    filename: item.name,
                  },
                  type: "document",
                  caption: isLastDocument ? answerText : undefined,
                  parse_mode: "HTML",
                });
              }

              request = documents;
            }

            await context.sendMediaGroup(request);
          }
        } else {
          await sendPlainMessage();
        }
        break;
      }
      case ElementType.INPUT_TEXT: {
        const inputTextElement = element as InputTextUIElement;
        if (isNil(inputTextElement.variableId)) {
          throw new Error("InvalidOperationError: input without variable");
        }
        const inputVariable = this._utils.getVariableById(inputTextElement.variableId);

        const typedValueFromText = this._utils.getTypedValueFromText((context.message as Message.TextMessage).text, inputVariable.type);

        userContext.updateVariable(inputVariable.name, typedValueFromText);
        break;
      }
      case ElementType.LOGIC_CHANGE_VARIABLE: {
        this.handleChangeVariableElement(element as ChangeVariableUIElement, userContext);
        break;
      }
      case ElementType.LOGIC_CONDITION: {
        shouldCalcNextStep = this.handleLogicConditionElement(element as ConditionUIElement, userContext);
        break;
      }
      case ElementType.LOGIC_EDIT_MESSAGE: {
        await this.handleLogicEditMessageElement(element as EditMessageUIElement, userContext);
        break;
      }
      case ElementType.LOGIC_REMOVE_MESSAGE: {
        await this.handleLogicRemoveMessageElement(element as RemoveMessageUIElement);
        break;
      }
      case ElementType.INTEGRATION_SEND_TELEGRAM_MESSAGE: {
        await this.handleSendTelegramMessageElement(element as SendTelegramMessageIntegrationUIElement, userContext);
        break;
      }
      default: {
        throw new Error(`Unsupported element type: ${element.type}`);
      }
    }

    if (shouldCalcNextStep) {
      this.calcNextStep(userContext, block, element);
    }

    void this.checkNextElement(userContext, context);
  }

  private handleLogicConditionElement(element: ConditionUIElement, userContext: UserContext): boolean {
    const conditionIsTrue = ConditionChecker.check(element, this._utils, userContext);

    if (conditionIsTrue) {
      const link = this._botProject.links.find((l) => (l.output as ButtonPortDescription).buttonId === element.id);
      if (isNil(link)) {
        return true;
      }

      const block = this._utils.getBlockById(link.input.blockId);

      userContext.setNextStep({
        blockId: block.id,
        elementId: block.elements[0].id,
      });

      return false;
    }

    return true;
  }

  private handleChangeVariableElement(element: ChangeVariableUIElement, userContext: UserContext) {
    if (!element.selectedVariableId) {
      throw new Error("InvalidOperationError: variable is null");
    }

    const variable = this._utils.getVariableById(element.selectedVariableId);
    if (element.restoreInitialValue) {
      userContext.updateVariable(variable.name, JSON.parse(variable.value as string));
      return;
    }

    let newValue: number | string | null | boolean | object | unknown[] = null;

    switch (variable.type) {
      case VariableType.NUMBER: {
        if (isNil(element.workflowDescription)) {
          break;
        }

        const expression = (element.workflowDescription as ChangeNumberStringVariableWorkflow).expression;

        newValue = this._utils.getNumberValueFromExpression(expression, userContext);

        break;
      }
      case VariableType.STRING: {
        if (isNil(element.workflowDescription)) {
          break;
        }

        const expression = (element.workflowDescription as ChangeNumberStringVariableWorkflow).expression;

        newValue = this._utils.getStringValueFromExpression(expression, userContext);

        break;
      }
      case VariableType.BOOLEAN: {
        if (isNil(element.workflowDescription)) {
          break;
        }

        const workflowDescription = element.workflowDescription as ChangeBooleanVariableWorkflow;

        newValue = this._utils.getBooleanValue(workflowDescription.strategy, variable, userContext);
        break;
      }
      case VariableType.ARRAY: {
        if (isNil(element.workflowDescription)) {
          break;
        }

        const workflowDescription = element.workflowDescription as ChangeArrayVariableWorkflow;

        newValue = ChangeArrayVariableHelper.getArrayValue(workflowDescription, variable, userContext, this._utils);

        break;
      }

      case VariableType.OBJECT: {
        if (isNil(element.workflowDescription)) {
          break;
        }

        const workflowDescription = element.workflowDescription as ChangeObjectVariableWorkflow;

        newValue = ChangeObjectVariableHelper.getObjectValue(workflowDescription, userContext, this._utils) as object;
        break;
      }

      default: {
        throw new Error("NotImplementedError. Unknown variable type.");
      }
    }

    if (!isNil(newValue)) {
      userContext.updateVariable(variable.name, newValue);
    }
  }

  private async checkNextElement(
    userContext: UserContext,
    context: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>,
    // block: FlowDesignerUIBlockDescription,
    // element: UIElement
  ) {
    const nextStep = userContext.nextStep;
    if (isNil(nextStep)) {
      return;
    }

    const block = this._botProject.blocks.find((b) => b.id === nextStep?.blockId);

    if (isNil(block)) {
      return;
    }

    const nextElement = block.elements.find((e) => e.id === nextStep.elementId);

    // const currentElementIndex = block.elements.findIndex((e) => e === element);
    // const nextElement = block.elements[currentElementIndex + 1];

    if (isNil(nextElement)) {
      return;
    }

    switch (nextElement.type) {
      case ElementType.LOGIC_CONDITION:
      case ElementType.LOGIC_CHANGE_VARIABLE:
      case ElementType.LOGIC_EDIT_MESSAGE:
      case ElementType.LOGIC_REMOVE_MESSAGE:
      case ElementType.INTEGRATION_SEND_TELEGRAM_MESSAGE:
      case ElementType.CONTENT_TEXT: {
        await this.handleElement(userContext, context, block, nextElement);
        break;
      }
    }
  }

  private async handleLogicEditMessageElement(element: EditMessageUIElement, userContext: UserContext) {
    const messageDescription = element.editedMessage;
    if (isNil(messageDescription) || isNil(messageDescription.telegramContent) || isNil(element.messageElementId)) {
      return;
    }

    const answerText = this._utils.getParsedText(messageDescription.telegramContent, userContext);
    const messageButtons = MessageButtonsManager.getButtonsForMessage(userContext, element.id, messageDescription, this._utils);
    const sentMessageData = this._messageStore.getSentMessageData(element.messageElementId);
    if (isNil(sentMessageData)) {
      return;
    }

    try {
      await this._bot.telegram.editMessageText(sentMessageData.chat.id, sentMessageData.message_id, undefined, answerText, {
        parse_mode: "HTML",
        reply_markup: !isNil(messageButtons)
          ? {
              inline_keyboard: messageButtons,
            }
          : undefined,
      });
    } catch (e) {
      console.log("editMessageText", e);
    }
  }

  private async handleLogicRemoveMessageElement(element: RemoveMessageUIElement) {
    if (isNil(element.messageElementId)) {
      return;
    }

    const sentMessageData = this._messageStore.getSentMessageData(element.messageElementId);
    if (isNil(sentMessageData)) {
      return;
    }

    try {
      await this._bot.telegram.deleteMessage(sentMessageData.chat.id, sentMessageData.message_id);
    } catch (e) {
      console.log("deleteMessage", e);
    }
  }

  public stop() {
    this._bot.stop();
  }

  private async handleSendTelegramMessageElement(element: SendTelegramMessageIntegrationUIElement, userContext: UserContext) {
    if (isNil(element.connectionId)) {
      return;
    }

    const connection = this._botProject.connections.find((c) => c.id === element.connectionId) as TelegramConnectionDescription;
    if (isNil(connection) || !connection.botToken || !connection.targetChatId) {
      return;
    }
    try {
      const bot = new Telegraf(connection.botToken);

      await bot.telegram.sendMessage(connection.targetChatId, this._utils.getParsedText(element.telegramContent ?? "", userContext), {
        parse_mode: "HTML",
      });
    } catch (e) {
      console.log("handleSendTelegramMessageElement", e);
    }
  }
}
