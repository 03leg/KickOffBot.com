import {
  BotProject,
  ChatItemWebRuntime,
  StartSavedBotResponse,
  WebBotResponse,
} from "@kickoffbot.com/types";
import axios from "axios";
import { env } from "~/env.mjs";

export class WebRuntimeService {
  private static host = env.NEXT_PUBLIC_WEB_BOT_RUNTIME_HOST;

  public async uploadDemoProject(
    projectId: string,
    project: BotProject
  ): Promise<string> {
    const testProjectResponse = await axios.post(
      WebRuntimeService.host + `/api/web-bot-runtime/upload-demo-project`,
      {
        project,
        projectId,
      }
    );

    return testProjectResponse.data as string;
  }

  public async startSavedBot(projectId: string) {
    const startResponse = await axios.get(
      WebRuntimeService.host +
        `/api/web-bot-runtime/start-bot?projectId=${projectId}`
    );

    return startResponse.data as StartSavedBotResponse;
  }

  async startDemoBot(demoProjectId: string) {
    const startResponse = await axios.get(
      WebRuntimeService.host +
        `/api/web-bot-runtime/start-demo-bot?demoProjectId=${demoProjectId}`
    );

    return startResponse.data as WebBotResponse;
  }

  async sendUserResponse(
    demoProjectId: string,
    chatItemRequest: ChatItemWebRuntime,
    value: unknown
  ) {
    const startResponse = await axios.post(
      WebRuntimeService.host +
        `/api/web-bot-runtime/next-step?demoProjectId=${demoProjectId}`,
      {
        elementId: chatItemRequest.uiElementId,
        value,
      }
    );

    return startResponse.data as WebBotResponse;
  }
}
