/* eslint-disable react-hooks/rules-of-hooks */
import {
  BotProject,
  ElementType,
  FlowDesignerUIBlockDescription,
  UIElement,
  WebContentTextUIElement,
} from "@kickoffbot.com/types";
import { MyBotUtils } from "./ChatManager.utils";
import { ChatStoreState } from "../store/store.types";
import { throwIfNil } from "~/utils/guard";
import { WebUserContext } from "./WebUserContext";
import { isNil } from "lodash";

export class ChatManager {
  private _storeApi?: Partial<ChatStoreState>;
  private _utils?: MyBotUtils;
  private _botProject?: BotProject;

  public init(project: BotProject, storeApi: Partial<ChatStoreState>) {
    this._storeApi = storeApi;
    this._botProject = project;
    this._storeApi.clearHistory?.();

    const userContext = new WebUserContext(project);

    this._utils = new MyBotUtils(project);
    const startLink = this._utils.getLinkByBlockId("/start");
    const block = this._utils.getBlockById(startLink.input.blockId);

    const firstElement = block.elements[0] as WebContentTextUIElement;

    this.handleElement(block, firstElement, userContext);
  }

  public handleElement(
    block: FlowDesignerUIBlockDescription,
    element: UIElement,
    userContext: WebUserContext
  ) {
    throwIfNil(this._utils);

    const shouldCalcNextStep = true;

    switch (element.type) {
      case ElementType.WEB_CONTENT_MESSAGE: {
        const typedElement = element as WebContentTextUIElement;
        const messageText = this._utils.getParsedText(
          typedElement.htmlContent ?? "",
          userContext
        );

        this._storeApi?.sendBotMessage?.({
          message: messageText,
          attachments: typedElement.attachments,
        });

        break;
      }
    }

    if (shouldCalcNextStep) {
      this.calcNextStep(userContext, block, element);
    }

    void this.checkNextElement(userContext);
  }

  private checkNextElement(userContext: WebUserContext) {
    throwIfNil(this._botProject);

    const nextStep = userContext.nextStep;
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
      case ElementType.WEB_CONTENT_MESSAGE: {
        this.handleElement(block, nextElement, userContext);
        break;
      }
    }
  }

  private calcNextStep(
    userContext: WebUserContext,
    currentBlock: FlowDesignerUIBlockDescription,
    currentElement: UIElement
  ) {
    throwIfNil(this._botProject);
    throwIfNil(this._utils);

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
      userContext.setNextStep(null);
    } else {
      userContext.setNextStep({
        blockId: nextBlock.id,
        elementId: nextElement.id,
      });
    }
  }
}
