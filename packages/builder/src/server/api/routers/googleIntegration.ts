import { SheetDescription } from "@kickoffbot.com/types";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { isNil } from "lodash";
import { z } from "zod";
import { googleOAuthClient } from "~/constants/google-auth/googleOAuthClient";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { updateGoogleAccountTokens } from "~/utils/updateGoogleAccountTokens";

export const googleIntegration = createTRPCRouter({
  getGoogleAccounts: protectedProcedure.query(async ({ ctx, input }) => {
    const userId = ctx.session?.user.id;

    const googleAccounts = await prisma.googleIntegrationAccount.findMany({
      where: { userId },
    });

    for (const googleAccount of googleAccounts) {
      const updatedCredentials = await updateGoogleAccountTokens(
        googleAccount.credentials
      );

      googleAccount.accessToken = updatedCredentials.credentials.access_token ?? '';

      void prisma.googleIntegrationAccount.update({
        where: { id: googleAccount.id },
        data: {
          credentials: btoa(JSON.stringify(updatedCredentials)),
          accessToken: updatedCredentials.credentials.access_token ?? '',
        },
      });
    }

    return googleAccounts;
  }),
  deleteGoogleAccount: protectedProcedure
    .input(z.object({ connectionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      return prisma.googleIntegrationAccount.delete({
        where: { id: input.connectionId, userId },
      });
    }),
  getSheets: protectedProcedure
    .input(
      z.object({
        connectionId: z.string().optional(),
        spreadSheetId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.connectionId || !input.spreadSheetId) return [];

      const userId = ctx.session?.user.id;
      const connection = await prisma.googleIntegrationAccount.findUnique({
        where: { id: input.connectionId, userId },
      });
      if (!connection) {
        return [];
      }

      googleOAuthClient.setCredentials({
        ...JSON.parse(atob(connection.credentials)),
      });

      const spreadSheet = new GoogleSpreadsheet(
        input.spreadSheetId,
        googleOAuthClient
      );

      await spreadSheet.loadInfo();

      const sheetsResult: SheetDescription[] = [];

      for (
        let sheetCount = 0;
        sheetCount < spreadSheet.sheetCount;
        sheetCount++
      ) {
        const sheet = spreadSheet.sheetsByIndex[sheetCount];

        if (isNil(sheet)) continue;

        const sheetDescription: SheetDescription = {
          id: sheet.sheetId,
          title: sheet.title,
          headerValues: [],
        };

        try {
          await sheet.loadHeaderRow();
          sheetDescription.headerValues = sheet.headerValues;
        } catch {}

        sheetsResult.push(sheetDescription);
      }

      return sheetsResult;
    }),
});
