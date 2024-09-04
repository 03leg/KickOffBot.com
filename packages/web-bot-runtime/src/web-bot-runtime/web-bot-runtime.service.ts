import { BotProject, WebBotResponse } from '@kickoffbot.com/types';
import { Injectable } from '@nestjs/common';
import { WebBotRuntime } from 'src/runtime/WebBotRuntime';
import { v4 } from 'uuid';

@Injectable()
export class WebBotRuntimeService {
  private _metadataBotProjectMap = new Map<string, BotProject>();
  private _runtimeMap = new Map<string, WebBotRuntime>();

  uploadDemoProject(projectId: string, project: BotProject): string {
    const demoProjectId = v4();

    this._metadataBotProjectMap.set(demoProjectId, project);

    return demoProjectId;
  }

  async startDemoBot(demoProjectId: string) {
    const demoProject = this._metadataBotProjectMap.get(demoProjectId);
    if (!demoProject) {
      throw new Error('InvalidOperationError: demoProject is null');
    }

    const runtime = new WebBotRuntime(demoProject);

    const newChatItems = await runtime.startBot();

    const response: WebBotResponse = {
      newItems: newChatItems,
    };

    this._runtimeMap.set(demoProjectId, runtime);

    return response;
  }

  async nextStep(demoProjectId: string, elementId: string, value: unknown) {
    const runtime = this._runtimeMap.get(demoProjectId);
    if (!runtime) {
      throw new Error('InvalidOperationError: runtime is null');
    }

    const newChatItems = await runtime.handleUserResponse(elementId, value);

    const response: WebBotResponse = {
      newItems: newChatItems,
    };

    return response;
  }
}
