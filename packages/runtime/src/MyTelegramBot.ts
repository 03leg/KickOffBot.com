import {
  Update,
  Message,
  InlineKeyboardButton,
} from "telegraf/typings/core/types/typegram";
import { Context, NarrowedContext, Telegraf } from "telegraf";
import { UserContext } from "./UserContext";
import { isNil } from "lodash";
import { getUserContextKey } from "./utils";
import { MyBotUtils } from "./MyBotUtils";
import { BotProject, ButtonPortDescription, ContentTextUIElement, ElementType, FlowDesignerUIBlockDescription, InputButtonsUIElement, InputTextUIElement, UIElement } from "@kickoffbot.com/types";

export class MyTelegramBot {
  private _bot: Telegraf;
  private _botProject: BotProject;
  private _state = new Map<number, UserContext>();
  private _utils = new MyBotUtils();

  constructor(token: string, botProject: BotProject) {
    this._bot = new Telegraf(token);
    this._botProject = botProject;
    this._utils.setProject(this._botProject);
  }

  async setup() {
    this._bot.start(this.handleStart.bind(this));
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

  private async handleStart(
    context: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
  ) {
    console.log('start')
    const userContext = new UserContext(this._botProject);
    userContext.updateTelegramVariableBasedOnMessage(context);

    const startLink = this._utils.getLinkByBlockId("/start");
    const block = this._utils.getBlockById(startLink.input.blockId);

    await this.handleElement(userContext, context, block, block.elements[0]);

    this.saveNextStepInUserContext(userContext, block, block.elements[0]);

    this._state.set(getUserContextKey(context), userContext);
  }

  private saveNextStepInUserContext(
    userContext: UserContext,
    currentBlock: FlowDesignerUIBlockDescription,
    currentElement: UIElement
  ) {
    let nextBlock: FlowDesignerUIBlockDescription | null = null;
    let nextElement: UIElement | null = null;

    if (
      currentBlock.elements[currentBlock.elements.length - 1] === currentElement
    ) {
      const link = this._botProject.links.find(
        (link) => link.output.blockId === currentBlock.id
      );

      if (!isNil(link)) {
        nextBlock =
          this._botProject.blocks.find((b) => b.id === link.input.blockId) ??
          null;
        if (!isNil(nextBlock)) {
          nextElement = nextBlock.elements[0];
        }
      }
    } else {
      nextBlock = currentBlock;
      nextElement =
        currentBlock.elements[
          currentBlock.elements.indexOf(currentElement) + 1
        ];
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

  private async handleCallbackQuery(
    context: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
  ) {
    const userContext = this._state.get(getUserContextKey(context));
    if (isNil(userContext)) {
      throw new Error("InvalidOperationError: userContext is null");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buttonId = (context.callbackQuery as any).data;

    const link = this._botProject.links.find(
      (l) => (l.output as ButtonPortDescription).buttonId === buttonId
    );

    if (isNil(link)) {
      await context.answerCbQuery("Link is empty!");
      return;
    }

    const block = this._utils.getBlockById(link.input.blockId);
    const element = block.elements[0];

    await this.handleElement(userContext, context, block, element);
    void context.answerCbQuery();
  }

  private async handleMessage(
    context: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
  ) {
    const userContext = this._state.get(getUserContextKey(context));
    if (isNil(userContext)) {
      throw new Error("InvalidOperationError: userContext is null");
    }
    const nextStep = userContext.nextStep;
    if (isNil(nextStep)) {
      return;
    }

    const block = this._utils.getBlockById(nextStep.blockId);
    const element = this._utils.getElementById(
      block.elements,
      nextStep.elementId
    );

    await this.handleElement(userContext, context, block, element);
  }

  private async handleElement(
    userContext: UserContext,
    context: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>,
    block: FlowDesignerUIBlockDescription,
    element: UIElement
  ) {
    switch (element.type) {
      case ElementType.CONTENT_TEXT: {
        const contentTextElement = element as ContentTextUIElement;
        if (isNil(contentTextElement.telegramContent)) {
          throw new Error("InvalidOperationError: telegramContent is null");
        }

        const answerText = this._utils.getMessage(
          contentTextElement.telegramContent,
          userContext
        );

        const messageButtons = this.getButtonsForMessage(block, element);

        await context.sendMessage(answerText, {
          parse_mode: "HTML",
          reply_markup: !isNil(messageButtons)
            ? {
                inline_keyboard: messageButtons,
              }
            : undefined,
        });
        break;
      }
      case ElementType.INPUT_TEXT: {
        const inputTextElement = element as InputTextUIElement;
        if (isNil(inputTextElement.variableId)) {
          throw new Error("InvalidOperationError: input without variable");
        }
        const inputVariable = this._utils.getVariableById(
          inputTextElement.variableId
        );
        userContext.updateVariable(
          inputVariable.name,
          (context.message as Message.TextMessage).text
        );
        break;
      }
    }

    this.saveNextStepInUserContext(userContext, block, element);

    void this.checkNextElement(userContext, context, block, element);
  }

  private getButtonsForMessage(
    block: FlowDesignerUIBlockDescription,
    element: UIElement
  ): InlineKeyboardButton.CallbackButton[][] | null {
    const result: InlineKeyboardButton.CallbackButton[][] = [];

    if (block.elements[block.elements.length - 1] == element) {
      return null;
    }

    const nextElement =
      block.elements[block.elements.findIndex((e) => e.id === element.id) + 1];

    if (nextElement.type === ElementType.INPUT_BUTTONS) {
      const buttonsElement = nextElement as InputButtonsUIElement;
      for (const button of buttonsElement.buttons) {
        result.push([{ callback_data: button.id, text: button.content }]);
      }

      const nextBlockButtons = this.getButtonsForMessage(block, nextElement);
      if (nextBlockButtons !== null) {
        result.push(...nextBlockButtons);
      }
    }

    if (result.length === 0) {
      return null;
    }

    return result;
  }

  private async checkNextElement(
    userContext: UserContext,
    context: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>,
    block: FlowDesignerUIBlockDescription,
    element: UIElement
  ) {
    const currentElementIndex = block.elements.findIndex((e) => e === element);
    const nextElement = block.elements[currentElementIndex + 1];

    if (isNil(nextElement)) {
      return;
    }

    switch (nextElement.type) {
      case ElementType.CONTENT_TEXT: {
        await this.handleElement(userContext, context, block, nextElement);
        break;
      }
    }
  }
}
