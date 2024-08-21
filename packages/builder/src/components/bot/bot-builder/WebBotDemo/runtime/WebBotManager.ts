/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable react-hooks/rules-of-hooks */
import {
  BotProject,
  ElementType,
  FlowDesignerUIBlockDescription,
  UIElement,
  WebContentTextUIElement,
  WebInputNumberUIElement,
  WebInputTextUIElement,
} from "@kickoffbot.com/types";
import { WebBotManagerUtils } from "./WebBotManager.utils";
import { ChatStoreState } from "../store/store.types";
import { throwIfNil } from "~/utils/guard";
import { WebUserContext } from "./WebUserContext";
import { isNil } from "lodash";

export class WebBotManager {
  private _storeApi?: Partial<ChatStoreState>;
  private _utils?: WebBotManagerUtils;
  private _botProject?: BotProject;
  private _userContext?: WebUserContext;

  public init(project: BotProject, storeApi: Partial<ChatStoreState>) {
    this._storeApi = storeApi;
    this._botProject = project;

    this._storeApi.clearHistory?.();
    this._utils = new WebBotManagerUtils(project);

    this._userContext = new WebUserContext(project, this._utils);

    const startLink = this._utils.getLinkByBlockId("/start");
    const block = this._utils.getBlockById(startLink.input.blockId);

    const firstElement = block.elements[0] as WebContentTextUIElement;

    void this.handleElement(block, firstElement);
  }

  public async handleElement(
    block: FlowDesignerUIBlockDescription,
    element: UIElement
  ) {
    throwIfNil(this._utils);
    throwIfNil(this._storeApi?.sendBotRequest);
    throwIfNil(this._storeApi?.sendBotMessage);
    throwIfNil(this._userContext);

    const shouldCalcNextStep = true;
    let shouldHandleNextElement = true;

    switch (element.type) {
      case ElementType.WEB_CONTENT_MESSAGE: {
        const typedElement = element as WebContentTextUIElement;
        const messageText = this._utils.getParsedText(
          typedElement.htmlContent ?? "",
          this._userContext
        );

        await this._storeApi.sendBotMessage({
          message: messageText,
          attachments: typedElement.attachments,
        });

        break;
      }
      case ElementType.WEB_INPUT_DATE_TIME:
      case ElementType.WEB_INPUT_NUMBER:
      case ElementType.WEB_INPUT_TEXT: {
        const typedElement = element as
          | WebInputTextUIElement
          | WebInputNumberUIElement;
        const userContext = this._userContext;
        const utils = this._utils;

        const requestId = this._storeApi.sendBotRequest({
          element: typedElement,
          userContext: userContext,
          onResponse: (response) => {
            throwIfNil(typedElement.variableId);
            throwIfNil(this._storeApi?.removeChatItem);
            throwIfNil(this._storeApi?.sendUserResponse);

            const variable = utils.getVariableById(typedElement.variableId);
            userContext.updateVariable(variable.name, response.data);

            this._storeApi.removeChatItem(requestId);
            this._storeApi.sendUserResponse({
              message: response.data as string,
            });

            void this.checkNextElement();
          },
        });
        shouldHandleNextElement = false;

        break;
      }

      default: {
        throw new Error("NotImplementedError");
      }
    }

    if (shouldCalcNextStep) {
      this.calcNextStep(block, element);
    }

    if (shouldHandleNextElement) {
      await this.checkNextElement();
    }
  }

  private async checkNextElement() {
    throwIfNil(this._botProject);
    throwIfNil(this._userContext);

    const nextStep = this._userContext.nextStep;

    if (isNil(nextStep)) {
      return;
    }

    const block = this._botProject.blocks.find(
      (b) => b.id === nextStep?.blockId
    );

    if (isNil(block)) {
      return;
    }

    const nextElement = block.elements.find((e) => e.id === nextStep.elementId);

    if (isNil(nextElement)) {
      return;
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
      case ElementType.WEB_CONTENT_MESSAGE: {
        await this.handleElement(block, nextElement);
        break;
      }
    }
  }

  private calcNextStep(
    currentBlock: FlowDesignerUIBlockDescription,
    currentElement: UIElement
  ) {
    throwIfNil(this._botProject);
    throwIfNil(this._utils);
    throwIfNil(this._userContext);

    let nextBlock: FlowDesignerUIBlockDescription | null = null;
    let nextElement: UIElement | null = null;

    if (
      currentBlock.elements[currentBlock.elements.length - 1] === currentElement
    ) {
      const link = this._utils.getLinkFromBlock(currentBlock);
      if (!isNil(link)) {
        nextBlock =
          this._botProject.blocks.find((b) => b.id === link.input.blockId) ??
          null;
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
}
