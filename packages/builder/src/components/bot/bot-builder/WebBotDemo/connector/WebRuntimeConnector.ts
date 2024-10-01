import {
  BotProject,
  CardsUserResponse,
  ChatItemTypeWebRuntime,
  ChatItemWebRuntime,
  DeleteMessagesDescriptionWebRuntime,
  ElementType,
  RequestButtonDescription,
  RequestDescriptionWebRuntime,
  UserResponseDescriptionWebRuntime,
  WebBotResponse,
} from "@kickoffbot.com/types";
import { ChatStoreState } from "../store/store.types";
import { WebRuntimeService } from "./WebRuntimeService";
import { throwIfNil } from "~/utils/guard";

export class WebRuntimeConnector {
  private _storeApi: ChatStoreState;
  private _botProject?: BotProject;
  private _httpService = new WebRuntimeService();
  private _projectId: string;
  private _runtimeProjectId: string | null = null;

  constructor(
    project: BotProject | undefined,
    projectId: string,
    storeApi: ChatStoreState
  ) {
    this._storeApi = storeApi;
    this._botProject = project;
    this._projectId = projectId;
  }

  // TODO: Add error handling
  async connect() {
    this._storeApi.clearHistory();

    this._storeApi.setLoadingValue(true);

    let response: WebBotResponse | null = null;

    if (this._botProject) {
      this._runtimeProjectId = await this._httpService.uploadDemoProject(
        this._projectId,
        this._botProject
      );
      if (this._runtimeProjectId == null) {
        return false;
      }
  
      response = await this._httpService.startDemoBot(
        this._runtimeProjectId
      );

    } else {
      const startSavedBotResponse = await this._httpService.startSavedBot(this._projectId);
      throwIfNil(startSavedBotResponse?.runtimeProjectId);
      
      this._runtimeProjectId = startSavedBotResponse.runtimeProjectId;
      response = startSavedBotResponse;
    }

    if (response) {
      await this.toStore(response);
    }

    this._storeApi.setLoadingValue(false);
  }

  private async toStore(response: WebBotResponse) {
    for (const item of response.newItems) {
      if (item.itemType === ChatItemTypeWebRuntime.BOT_MESSAGE) {
        await this._storeApi.sendBotMessage(item);
      } else if (item.itemType === ChatItemTypeWebRuntime.BOT_REQUEST) {
        const requestContent = item.content as RequestDescriptionWebRuntime;
        requestContent.onResponse = this.handleResponse.bind(this, item);
        this._storeApi.sendBotRequest(item);
      } else if (item.itemType === ChatItemTypeWebRuntime.DELETE_MESSAGES) {
        const requestContent =
          item.content as DeleteMessagesDescriptionWebRuntime;
        if (requestContent.deleteAllMessages) {
          this._storeApi.clearHistory();
        } else if (
          requestContent.elementIds &&
          requestContent.elementIds.length > 0
        ) {
          this._storeApi.removeChatItemByUIElementId(requestContent.elementIds);
        }
      }
    }
  }

  private static getUserResponseContent(
    chatItemRequest: ChatItemWebRuntime,
    userData: UserResponseDescriptionWebRuntime
  ) {
    const requestElement =
      chatItemRequest.content as RequestDescriptionWebRuntime;

    if (requestElement.element.elementType === ElementType.WEB_INPUT_BUTTONS) {
      const button = userData.data as RequestButtonDescription;
      return button.content;
    }

    if (requestElement.element.elementType === ElementType.WEB_INPUT_CARDS) {
      const cardResponseData = userData.data as CardsUserResponse;
      let responseText = cardResponseData.selectedCards
        .map((c) => c.value)
        .join(", ");

      if (cardResponseData.clickedButton) {
        responseText =
          cardResponseData.clickedButton.content + ", " + responseText;
      }

      if (cardResponseData.actionName) {
        responseText = cardResponseData.actionName;
      }

      return responseText;
    }

    return userData.data as string;
  }

  private async handleResponse(
    chatItemRequest: ChatItemWebRuntime,
    userData: UserResponseDescriptionWebRuntime
  ) {
    throwIfNil(this._runtimeProjectId);

    this._storeApi.removeChatItem(chatItemRequest.id);
    this._storeApi.sendUserResponse(chatItemRequest.uiElementId, {
      message: WebRuntimeConnector.getUserResponseContent(
        chatItemRequest,
        userData
      ),
    });

    this._storeApi.setLoadingValue(true);

    const response = await this._httpService.sendUserResponse(
      this._runtimeProjectId,
      chatItemRequest,
      userData.data
    );

    if (response) {
      await this.toStore(response);
    }

    this._storeApi.setLoadingValue(false);
  }
}
