import { PrismaClient } from "@prisma/client";
import { isNil } from "lodash";
import { BotTokenModel } from "./types";

export class BotManager {
  private static _prisma = new PrismaClient();

  public static async getBotTokens() {
    const changedBots = await this._prisma.botToken.findMany({});

    return changedBots;
  }

  public static async getBotDescription({ botId }: { botId: string }) {
    const botDescription = await this._prisma.botDescription.findUnique({
      where: { id: botId },
    });

    return botDescription;
  }

  public static async getContent(data: { contentId: string | null } | null) {
    if (isNil(data) || isNil(data.contentId)) {
      return;
    }

    const botDescription = await this._prisma.botContent.findUnique({
      where: { id: data.contentId },
    });

    return botDescription;
  }

  public static async updateRequestActiveValue(changedBot: BotTokenModel, requestActiveValue: boolean, operationResult: boolean) {
    await this._prisma.botToken.update({
      where: { id: changedBot.id },
      data: {
        requestActiveValue: null,
        isActive: operationResult ? requestActiveValue : !requestActiveValue,
      },
    });
  }

  public static async getGoogleIntegrationAccount(connectionId: string) {
    const googleAccount = await this._prisma.googleIntegrationAccount.findUnique({
      where: { id: connectionId },
    });

    return googleAccount;
  }
}
