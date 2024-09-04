import {
  BotProject,
  ChatItemWebRuntime,
  RequestDescriptionWebRuntime,
  WebBotResponse,
} from "@kickoffbot.com/types";
import axios from "axios";

export class WebRuntimeService {
  private static host = "http://localhost:3001";

  public async uploadDemoProject(
    projectId: string,
    project: BotProject
  ): Promise<string | null> {
    try {
      const testProjectResponse = await axios.post(
        WebRuntimeService.host + `/api/web-bot-runtime/upload-demo-project`,
        {
          project,
          projectId,
        }
      );

      return testProjectResponse.data as string;
    } catch (error) {
      return null;
    }
  }

  async startDemoBot(demoProjectId: string) {
    try {
      const startResponse = await axios.get(
        WebRuntimeService.host +
          `/api/web-bot-runtime/start-demo-bot?demoProjectId=${demoProjectId}`
      );

      return startResponse.data as WebBotResponse;
    } catch (error) {
      return null;
    }
  }

  async sendUserResponse(
    demoProjectId: string,
    chatItemRequest: ChatItemWebRuntime,
    value: unknown
  ) {
    try {
      const startResponse = await axios.post(
        WebRuntimeService.host + `/api/web-bot-runtime/next-step?demoProjectId=${demoProjectId}`,
        {
          elementId: chatItemRequest.uiElementId,
          value,
        }
      );

      return startResponse.data as WebBotResponse;
    } catch (error) {
      return null;
    }
  }
}
