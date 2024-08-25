/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable react-hooks/rules-of-hooks */
import {
  BotProject,
  ButtonPortDescription,
  ButtonsSourceStrategy,
  ChangeArrayVariableWorkflow,
  ChangeBooleanVariableWorkflow,
  ChangeNumberStringVariableWorkflow,
  ChangeObjectVariableWorkflow,
  ChangeVariableUIElement,
  ConditionUIElement,
  ElementType,
  FlowDesignerUIBlockDescription,
  UIElement,
  VariableType,
  WebContentTextUIElement,
  WebInputButtonsUIElement,
  WebInputDateTimeUIElement,
  WebInputEmailUIElement,
  WebInputNumberUIElement,
  WebInputPhoneUIElement,
  WebInputTextUIElement,
} from "@kickoffbot.com/types";
import { WebBotManagerUtils } from "./WebBotManager.utils";
import { ChatStoreState } from "../store/store.types";
import { throwIfNil } from "~/utils/guard";
import { WebUserContext } from "./WebUserContext";
import { isNil } from "lodash";
import { ResponseDescription } from "../types";
import { WebButtonDescription, WebButtonsManager } from "./WebButtonsManager";
import { ChangeArrayVariableHelper } from "./ChangeArrayVariableHelper";
import { ChangeObjectVariableHelper } from "./ChangeObjectVariableHelper";
import { ConditionChecker } from "./ConditionChecker";

export class WebBotManager {
  private _storeApi: Partial<ChatStoreState>;
  private _utils: WebBotManagerUtils;
  private _botProject: BotProject;
  private _userContext: WebUserContext;

  constructor(project: BotProject, storeApi: Partial<ChatStoreState>) {
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

  private handleButtonsResponse(
    typedElement: WebInputButtonsUIElement,
    requestId: string,
    response: ResponseDescription
  ) {
    throwIfNil(this._storeApi?.removeChatItem);
    throwIfNil(this._storeApi?.sendUserResponse);

    this._storeApi.removeChatItem(requestId);
    this._storeApi.sendUserResponse({
      message: (response.data as WebButtonDescription).text,
    });

    const btn = response.data as WebButtonDescription;
    const callbackData = btn.callback_data;

    const buttonsSourceStrategy =
      WebButtonsManager.getButtonsSourceStrategy(callbackData);
    let link;

    if (buttonsSourceStrategy === ButtonsSourceStrategy.FromVariable) {
      link = WebButtonsManager.handleCallbackQueryFromVariable(
        callbackData,
        this._botProject,
        this._userContext,
        this._utils
      );
    } else if (buttonsSourceStrategy === ButtonsSourceStrategy.Manual) {
      link = WebButtonsManager.handleCallbackQueryManual(
        callbackData,
        this._botProject
      );
    }

    if (isNil(link)) {
      console.log("Link is empty");
      return;
    }

    const block = this._utils.getBlockById(link.input.blockId);
    const element = block.elements[0];

    throwIfNil(element);

    void this.handleElement(block, element);
  }

  private handleUserInputResponse(
    typedElement:
      | WebInputTextUIElement
      | WebInputNumberUIElement
      | WebInputPhoneUIElement
      | WebInputEmailUIElement
      | WebInputDateTimeUIElement,
    requestId: string,
    response: ResponseDescription
  ) {
    throwIfNil(typedElement.variableId);
    throwIfNil(this._storeApi?.removeChatItem);
    throwIfNil(this._storeApi?.sendUserResponse);

    const variable = this._utils.getVariableById(typedElement.variableId);
    this._userContext.updateVariable(variable.name, response.data);

    this._storeApi.removeChatItem(requestId);
    this._storeApi.sendUserResponse({
      message: response.data as string,
    });

    void this.checkNextElement();
  }

  public async handleElement(
    block: FlowDesignerUIBlockDescription,
    element: UIElement
  ) {
    throwIfNil(this._utils);
    throwIfNil(this._storeApi?.sendBotRequest);
    throwIfNil(this._storeApi?.sendBotMessage);
    throwIfNil(this._userContext);

    let shouldCalcNextStep = true;
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
      case ElementType.WEB_INPUT_PHONE:
      case ElementType.WEB_INPUT_DATE_TIME:
      case ElementType.WEB_INPUT_NUMBER:
      case ElementType.WEB_INPUT_EMAIL:
      case ElementType.WEB_INPUT_BUTTONS:
      case ElementType.WEB_INPUT_TEXT: {
        const typedElement = element as
          | WebInputTextUIElement
          | WebInputNumberUIElement
          | WebInputPhoneUIElement
          | WebInputEmailUIElement
          | WebInputButtonsUIElement
          | WebInputDateTimeUIElement;
        const userContext = this._userContext;
        const utils = this._utils;

        const requestId = this._storeApi.sendBotRequest({
          element: typedElement,
          userContext: userContext,
          utils: utils,
          onResponse: (response) => {
            if (typedElement.type === ElementType.WEB_INPUT_BUTTONS) {
              this.handleButtonsResponse(
                typedElement as WebInputButtonsUIElement,
                requestId,
                response
              );
              return;
            }

            this.handleUserInputResponse(typedElement, requestId, response);
          },
        });
        shouldHandleNextElement = false;

        break;
      }
      case ElementType.LOGIC_CHANGE_VARIABLE: {
        this.handleChangeVariableElement(element as ChangeVariableUIElement);
        break;
      }
      case ElementType.LOGIC_CONDITION: {
        shouldCalcNextStep = this.handleLogicConditionElement(element as ConditionUIElement);
        console.log("shouldCalcNextStep", shouldCalcNextStep);
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

  private handleLogicConditionElement(element: ConditionUIElement): boolean {
    const conditionIsTrue = ConditionChecker.check(element, this._utils, this._userContext);

    if (conditionIsTrue) {
      const link = this._botProject.links.find((l) => (l.output as ButtonPortDescription).buttonId === element.id);
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

  private handleChangeVariableElement(element: ChangeVariableUIElement) {
    if (!element.selectedVariableId) {
      throw new Error("InvalidOperationError: variable is null");
    }

    const userContext = this._userContext;

    const variable = this._utils.getVariableById(element.selectedVariableId);
    if (element.restoreInitialValue) {
      try {
        userContext.updateVariable(
          variable.name,
          JSON.parse(variable.value as string)
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
          userContext
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
          userContext
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
          userContext
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
          this._utils
        );

        break;
      }

      case VariableType.OBJECT: {
        if (isNil(element.workflowDescription)) {
          break;
        }

        const workflowDescription =
          element.workflowDescription as ChangeObjectVariableWorkflow;

        newValue = ChangeObjectVariableHelper.getObjectValue(
          workflowDescription,
          userContext,
          this._utils
        ) as object;
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
      case ElementType.WEB_INPUT_PHONE:
      case ElementType.WEB_INPUT_EMAIL:
      case ElementType.WEB_INPUT_BUTTONS:
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
