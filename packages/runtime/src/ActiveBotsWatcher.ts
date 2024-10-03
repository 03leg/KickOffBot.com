import { isNil } from "lodash";
import { BotManager } from "./BotManager";
import { BotProject } from "@kickoffbot.com/types";
import { MyTelegramBot } from "./MyTelegramBot";
import { BotToken } from "@prisma/client";

interface MapValue {
  telegramBot: MyTelegramBot;
  contentId: string;
}

export class ActiveBotsWatcher {
  private _runtimeMap = new Map<string, MapValue>();
  private _intervalHandler: NodeJS.Timeout | null = null;
  private _dbCheckCount = 0;

  public async watch() {
    if (this._intervalHandler) {
      throw new Error("InvalidOperationError: Already started!");
    }

    await this.checkActualBotsState();

    this._intervalHandler = setInterval(async () => {
      await this.checkActualBotsState();

      if (this._dbCheckCount % 750 === 0) {
        console.log(this._dbCheckCount++ + ". DB is checked...");
      }
    }, 20 * 1000);
  }

  private async checkActualBotsState() {
    const botTokens = await BotManager.getBotTokens();
    const changedBots = botTokens.filter((t) => t.requestActiveValue !== null);
    const activeBots = botTokens.filter((t) => t.isActive === true);

    await this.checkWorkflowVersion(activeBots);
    await this.processChangedBot(changedBots);
    this.stopRemovedBots(botTokens);
  }

  private stopRemovedBots(bots: BotToken[]) {
    const dbBotIds = bots.map((b) => b.botId);
    const allRuntimeIds = Array.from(this._runtimeMap.keys());

    for (const id of allRuntimeIds) {
      if (!dbBotIds.includes(id)) {
        this.stopBot(id);
      }
    }
  }

  private async checkWorkflowVersion(activeBots: BotToken[]) {
    const tgTokens = new Set<string>();
    for (const changedBot of activeBots) {
      if (tgTokens.has(changedBot.token)) {
        continue;
      }

      await this.startBot(changedBot);
      tgTokens.add(changedBot.token);
    }
  }

  private async processChangedBot(changedBots: BotToken[]) {
    for (const changedBot of changedBots) {
      if (!isNil(changedBot.requestActiveValue)) {
        let result = false;
        if (changedBot.requestActiveValue) {
          result = await this.startBot(changedBot);
        } else {
          result = this.stopBot(changedBot.botId);
        }

        await BotManager.updateRequestActiveValue(changedBot, changedBot.requestActiveValue, result);
      }
    }
  }

  private stopBot(botId: BotToken["botId"]) {
    this._runtimeMap.get(botId)?.telegramBot.stop();
    this._runtimeMap.delete(botId);

    return true;
  }

  private async startBot(changedBot: BotToken) {
    const botDescription = await BotManager.getBotDescription(changedBot);

    if (isNil(botDescription) || isNil(botDescription.contentId)) {
      return false;
    }

    if (this._runtimeMap.has(botDescription.id) && this._runtimeMap.get(botDescription.id)?.contentId === botDescription.contentId) {
      return false;
    }

    if (this._runtimeMap.has(botDescription.id) && this._runtimeMap.get(botDescription.id)?.contentId !== botDescription.contentId) {
      const oldRuntimeInstance = this._runtimeMap.get(botDescription.id);
      if (isNil(oldRuntimeInstance)) {
        throw new Error("InvalidOperationError");
      }

      oldRuntimeInstance.telegramBot.stop();
      this._runtimeMap.delete(botDescription.id);
    }

    const actualContent = await BotManager.getContent(botDescription);
    if (isNil(actualContent) || isNil(actualContent.content)) {
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const botProject: BotProject = JSON.parse(actualContent.content.toString());
    const telegramBotRuntime = new MyTelegramBot(changedBot.token, botProject);

    void telegramBotRuntime.setup();

    this._runtimeMap.set(botDescription.id, {
      telegramBot: telegramBotRuntime,
      contentId: botDescription.contentId,
    });

    return true;
  }
}
