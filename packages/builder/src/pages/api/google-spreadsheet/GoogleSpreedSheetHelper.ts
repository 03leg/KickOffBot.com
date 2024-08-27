import { PrismaClient } from "@prisma/client";

export class GoogleSpreedSheetHelper {
  private static _prisma = new PrismaClient();

  public static async getGoogleIntegrationAccount(connectionId: string) {
    const googleAccount =
      await this._prisma.googleIntegrationAccount.findUnique({
        where: { id: connectionId },
      });

    return googleAccount;
  }
}
