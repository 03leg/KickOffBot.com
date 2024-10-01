import { BotProject } from '@kickoffbot.com/types';
import { PrismaClient } from '@prisma/client';

export class BotStore {
  private static _prisma = new PrismaClient();

  public static async getGoogleIntegrationAccount(connectionId: string) {
    const googleAccount =
      await this._prisma.googleIntegrationAccount.findUnique({
        where: { id: connectionId },
      });

    return googleAccount;
  }

  public static async getActualBotProjectById(
    projectId: string,
  ): Promise<BotProject | null> {
    const botDescription = await this._prisma.botDescription.findUnique({
      where: { deleted: false, id: projectId },
      select: { contentId: true, botType: true },
    });

    if (!botDescription || !botDescription.contentId) {
      return null;
    }

    const botContent = await this._prisma.botContent.findUnique({
      where: { id: botDescription.contentId },
      select: { content: true },
    });

    if (!botContent) {
      return null;
    }

    return JSON.parse(botContent.content.toString()) as BotProject;
  }
}
