import { isNil } from "lodash";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  BotContentScheme,
  BotDescriptionScheme,
  IdModelScheme,
  TelegramTokenScheme,
} from "~/types/Bot";
import { prisma } from "~/server/db";
import { TelegramToken } from "@kickoffbot.com/types";
import { getPreviewToken } from "~/server/utility/getPreviewToken";
import { z } from "zod";
import { Telegraf } from "telegraf";
import { getDbVersionProject } from "~/utils/getDbVersionProject";
// import fs from "fs";

export const botManagementRouter = createTRPCRouter({
  saveBot: protectedProcedure
    .input(BotDescriptionScheme)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      const currentBotDescription = await ctx.prisma.botDescription.upsert({
        create: { userId, name: input.name, botType: input.botType },
        update: { name: input.name },
        where: { id: input.id ?? "unknown", userId },
        select: { id: true },
      });

      if (!isNil(input.template)) {
        const createdContent = await prisma.botContent.create({
          data: { version: 0, content: input.template },
          select: { id: true },
        });
        await prisma.botDescription.update({
          data: { contentId: createdContent.id },
          where: { id: currentBotDescription.id },
        });
      }

      return currentBotDescription.id;
    }),
  saveBotContent: protectedProcedure
    .input(BotContentScheme)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      const project = getDbVersionProject(input.project);

      const projectDescription = await prisma.botDescription.findUnique({
        where: { userId, id: input.projectId },
        select: { contentId: true },
      });

      if (isNil(projectDescription?.contentId)) {
        const createdContent = await prisma.botContent.create({
          data: { version: 0, content: project },
          select: { id: true },
        });
        await prisma.botDescription.update({
          data: { contentId: createdContent.id },
          where: { id: input.projectId },
        });
      } else {
        const existBotContentItem = await prisma.botContent.findUnique({
          where: { id: projectDescription?.contentId },
          select: { version: true },
        });
        const newBotContentItem = await prisma.botContent.create({
          data: {
            version: (existBotContentItem?.version ?? 0) + 1,
            content: project,
          },
          select: { id: true },
        });
        await prisma.botDescription.update({
          data: { contentId: newBotContentItem.id },
          where: { id: input.projectId },
        });
      }

      // fs.writeFileSync("../runtime/dist/bot.json", input.project);
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session?.user.id;

    return ctx.prisma.botDescription.findMany({
      where: { userId, deleted: false },
    });
  }),
  getBotContent: protectedProcedure
    .input(IdModelScheme)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      const botDescription = await ctx.prisma.botDescription.findUnique({
        where: { userId, deleted: false, id: input.id },
        select: { contentId: true, botType: true },
      });
      if (isNil(botDescription)) {
        throw new Error("InvalidOperationError");
      }

      if (isNil(botDescription.contentId)) {
        return { content: null, botType: botDescription.botType };
      }

      const botContent = await ctx.prisma.botContent.findUnique({
        where: { id: botDescription.contentId },
        select: { content: true },
      });

      if (isNil(botContent)) {
        throw new Error("InvalidOperationError");
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return {
        content: botContent.content?.toString(),
        botType: botDescription.botType,
      };
    }),
  removeBot: protectedProcedure
    .input(BotDescriptionScheme)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      await prisma.botDescription.update({
        data: { deleted: true },
        where: { userId, id: input.id },
      });

      await prisma.botToken.deleteMany({
        where: { botId: input.id ?? "" },
      });
    }),
  addTelegramToken: protectedProcedure
    .input(TelegramTokenScheme)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      const projectDescription = await prisma.botDescription.findUnique({
        where: { userId, id: input.projectId },
        select: { id: true },
      });

      if (projectDescription) {
        await prisma.botToken.create({
          data: {
            botId: projectDescription.id,
            token: input.token,
          },
        });
      }
    }),
  getTelegramTokens: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      const projectDescription = await prisma.botDescription.findUnique({
        where: { userId, id: input.projectId },
        select: { id: true },
      });

      if (projectDescription) {
        const tokens = await prisma.botToken.findMany({
          where: { botId: projectDescription.id },
        });
        return tokens.map((item) => {
          const result: TelegramToken = {
            id: item.id,
            tokenPreview: getPreviewToken(item.token),
            isActiveNow: item.isActive,
            requestActiveValue: item.requestActiveValue,
          };

          return result;
        });
      }

      return [];
    }),
  deleteTelegramToken: protectedProcedure
    .input(
      z.object({
        tokenId: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      const projectDescription = await prisma.botDescription.findUnique({
        where: { userId, id: input.projectId },
        select: { id: true },
      });

      if (projectDescription) {
        await prisma.botToken.delete({
          where: { id: input.tokenId },
        });
      }
    }),
  startBot: protectedProcedure
    .input(
      z.object({
        tokenId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.botToken.update({
        data: {
          requestActiveValue: true,
        },
        where: {
          id: input.tokenId,
        },
      });
    }),
  stopBot: protectedProcedure
    .input(
      z.object({
        tokenId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.botToken.update({
        data: {
          requestActiveValue: false,
        },
        where: {
          id: input.tokenId,
        },
      });
    }),

  testTelegramConnection: protectedProcedure
    .input(
      z.object({
        botToken: z.string(),
        targetChatId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const bot = new Telegraf(input.botToken);

        await bot.telegram.sendMessage(input.targetChatId, "Test message...");
        return { result: true, message: "" };
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { result: false, message: (e as any).message };
      }
    }),
});
