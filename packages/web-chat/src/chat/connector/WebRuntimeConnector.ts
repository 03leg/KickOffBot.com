import {
  BotProject,
  CardsUserResponse,
  ChatItemTypeWebRuntime,
  ChatItemWebRuntime,
  ClientCodeDescriptionRuntime,
  CodeResultDescription,
  DeleteMessagesDescriptionWebRuntime,
  ElementType,
  RequestButtonDescription,
  RequestDescriptionWebRuntime,
  UserResponseDescriptionWebRuntime,
  WebBotResponse,
} from "@kickoffbot.com/types";
import { ChatStoreState } from "../store/store.types";
import { WebRuntimeService } from "./WebRuntimeService";
import { throwIfNil } from "../utils/guard";
import { ClientCodeExecutor } from "./ClientCodeExecutor";

export class WebRuntimeConnector {
  private _storeApi: ChatStoreState;
  private _botProject?: BotProject;
  private _httpService: WebRuntimeService;
  private _projectId: string;
  private _runtimeProjectId: string | null = null;

  constructor(
    project: BotProject | undefined,
    projectId: string,
    runtimeUrl: string,
    storeApi: ChatStoreState,
    private _externalVariables?: Record<string, unknown>
  ) {
    this._storeApi = storeApi;
    this._botProject = project;
    this._projectId = projectId;
    this._httpService = new WebRuntimeService(runtimeUrl);
  }

  // TODO: Add error handling
  async connect() {
    this._storeApi.clearHistory();

    this._storeApi.setLoadingValue(true);

    let response: WebBotResponse | null = null;

    try {
      if (this._botProject) {
        this._runtimeProjectId = await this._httpService.uploadDemoProject(this._projectId, this._botProject);

        response = await this._httpService.startDemoBot(this._runtimeProjectId, this._externalVariables);
      } else {
        const startSavedBotResponse = await this._httpService.startSavedBot(this._projectId, this._externalVariables);
        throwIfNil(startSavedBotResponse?.runtimeProjectId);

        this._runtimeProjectId = startSavedBotResponse.runtimeProjectId;
        response = startSavedBotResponse;
      }

      await this.toStore(response);
    } catch (e) {
      console.error(e);
      this._storeApi.showError("Failed to start the bot. Please try again.");
    } finally {
      this._storeApi.setLoadingValue(false);
    }
  }

  private async toStore(response: WebBotResponse) {
    for (const item of response.newItems) {
      switch (item.itemType) {
        case ChatItemTypeWebRuntime.BOT_MESSAGE: {
          await this._storeApi.sendBotMessage(item);
          break;
        }
        case ChatItemTypeWebRuntime.BOT_REQUEST: {
          const request = item.content as RequestDescriptionWebRuntime;
          request.onResponse = this.handleResponse.bind(this, item);
          this._storeApi.sendBotRequest(item);
          break;
        }
        case ChatItemTypeWebRuntime.DELETE_MESSAGES: {
          const deleteRequest = item.content as DeleteMessagesDescriptionWebRuntime;
          if (deleteRequest.deleteAllMessages) {
            this._storeApi.clearHistory();
          } else if (deleteRequest.elementIds) {
            this._storeApi.removeChatItemByUIElementId(deleteRequest.elementIds);
          }
          break;
        }
        case ChatItemTypeWebRuntime.CLIENT_CODE: {
          const clientCodeDescription = item.content as ClientCodeDescriptionRuntime;
          const result = await ClientCodeExecutor.execute(clientCodeDescription);

          await this.handleClientCodeExecuted(item, result);
          break;
        }
      }
    }
  }

  private static getUserResponseContent(chatItemRequest: ChatItemWebRuntime, userData: UserResponseDescriptionWebRuntime) {
    const requestElement = chatItemRequest.content as RequestDescriptionWebRuntime;

    if (requestElement.element.elementType === ElementType.WEB_INPUT_BUTTONS) {
      const button = userData.data as RequestButtonDescription;
      return button.content;
    }

    if (requestElement.element.elementType === ElementType.WEB_INPUT_CARDS) {
      const cardResponseData = userData.data as CardsUserResponse;
      let responseText = cardResponseData.selectedCards.map((c) => c.value).join(", ");

      if (cardResponseData.clickedCardButton) {
        responseText = cardResponseData.clickedCardButton.content + ", " + responseText;
      }

      if (cardResponseData.actionName) {
        responseText = cardResponseData.actionName;
      }

      return responseText;
    }

    if (userData.message) {
      return userData.message;
    }

    return userData.data as string;
  }

  private async handleResponse(chatItemRequest: ChatItemWebRuntime, userData: UserResponseDescriptionWebRuntime) {
    throwIfNil(this._runtimeProjectId);

    this._storeApi.removeChatItem(chatItemRequest.id);
    this._storeApi.sendUserResponse(chatItemRequest.uiElementId, {
      message: WebRuntimeConnector.getUserResponseContent(chatItemRequest, userData),
    });

    this._storeApi.setLoadingValue(true);

    try {
      const response = await this._httpService.sendUserResponse(this._runtimeProjectId, chatItemRequest, userData.data);

      await this.toStore(response);
    } catch {
      this._storeApi.showError("Failed to send your response. Please try to use bot later.");
    } finally {
      this._storeApi.setLoadingValue(false);
    }
  }

  private async handleClientCodeExecuted(chatItemRequest: ChatItemWebRuntime, codeResult: CodeResultDescription) {
    throwIfNil(this._runtimeProjectId);

    this._storeApi.setLoadingValue(true);

    try {
      const response = await this._httpService.sendUserResponse(this._runtimeProjectId, chatItemRequest, codeResult);

      await this.toStore(response);
    } catch {
      this._storeApi.showError("Failed to send client code result. Please try to use bot later.");
    } finally {
      this._storeApi.setLoadingValue(false);
    }
  }
}
