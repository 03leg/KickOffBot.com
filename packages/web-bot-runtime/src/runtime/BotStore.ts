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
  ): Promise<{ project: BotProject; botName: string; author: string } | null> {
    const botDescription = await this._prisma.botDescription.findUnique({
      where: { deleted: false, id: projectId },
      select: { contentId: true, botType: true, name: true, user: true },
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

    return {
      project: JSON.parse(botContent.content.toString()) as BotProject,
      botName: botDescription.name,
      author: botDescription.user.email,
    };
  }
}
