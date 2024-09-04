import {
  BotProject,
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
  private _botProject: BotProject;
  private _httpService = new WebRuntimeService();
  private _projectId: string;
  private _demoProjectId: string | null = null;

  constructor(
    project: BotProject,
    projectId: string,
    storeApi: ChatStoreState
  ) {
    this._storeApi = storeApi;
    this._botProject = project;
    this._projectId = projectId;
  }

  async connect() {
    this._storeApi.clearHistory();

    this._storeApi.setLoadingValue(true);
    this._demoProjectId = await this._httpService.uploadDemoProject(
      this._projectId,
      this._botProject
    );

    if (this._demoProjectId == null) {
      return false;
    }

    const response = await this._httpService.startDemoBot(this._demoProjectId);

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

    return userData.data as string;
  }

  private async handleResponse(
    chatItemRequest: ChatItemWebRuntime,
    userData: UserResponseDescriptionWebRuntime
  ) {
    throwIfNil(this._demoProjectId);

    this._storeApi.removeChatItem(chatItemRequest.id);
    this._storeApi.sendUserResponse(chatItemRequest.uiElementId, {
      message: WebRuntimeConnector.getUserResponseContent(
        chatItemRequest,
        userData
      ),
    });

    this._storeApi.setLoadingValue(true);

    const response = await this._httpService.sendUserResponse(
      this._demoProjectId,
      chatItemRequest,
      userData.data
    );

    if (response) {
      await this.toStore(response);
    }

    this._storeApi.setLoadingValue(false);
  }
}
