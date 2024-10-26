import { isNil } from "lodash";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  ApplyThemeScheme,
  BotContentScheme,
  BotDescription,
  BotDescriptionScheme,
  DeleteThemeScheme,
  GetAllThemesResponse,
  GetThemeByIdScheme,
  GetThemesScheme,
  IdModelScheme,
  TelegramTokenScheme,
  ThemeScheme,
} from "~/types/Bot";
import { prisma } from "~/server/db";
import { TelegramToken } from "@kickoffbot.com/types";
import { getPreviewToken } from "~/server/utility/getPreviewToken";
import { z } from "zod";
import { Telegraf } from "telegraf";
import { getDbVersionProject } from "~/utils/getDbVersionProject";
import { v4 } from "uuid";
import { Prisma } from "@prisma/client";
// import fs from "fs";

export const botManagementRouter = createTRPCRouter({
  deleteTheme: protectedProcedure
    .input(DeleteThemeScheme)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      await ctx.prisma.webBotTheme.update({
        where: { id: input.id, userId },
        data: { deleted: true },
      });
    }),
  applyTheme: protectedProcedure
    .input(ApplyThemeScheme)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      const { id: themeId } = await ctx.prisma.webBotTheme.findFirstOrThrow({
        where: { id: input.themeId, deleted: false },
        select: { id: true },
      });

      await ctx.prisma.botDescription.update({
        data: { themeId },
        where: { id: input.botId, userId },
      });
    }),
  saveTheme: protectedProcedure
    .input(ThemeScheme)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      let savedThemeId: string | null = null;

      if (!input.themeId) {
        const { id: themeId } = await ctx.prisma.webBotTheme.create({
          data: {
            userId,
            theme: input.theme,
            id: v4(),
            isPublic: false,
            title: input.title,
          },
          select: { id: true },
        });
        savedThemeId = themeId;
      } else {
        const { isPublic } = await ctx.prisma.webBotTheme.findFirstOrThrow({
          where: { id: input.themeId, deleted: false },
          select: { isPublic: true },
        });

        if (isPublic) {
          const { id: themeId } = await ctx.prisma.webBotTheme.create({
            data: {
              userId,
              theme: input.theme,
              id: v4(),
              isPublic: false,
              title: input.title,
            },
            select: { id: true },
          });
          savedThemeId = themeId;
        } else {
          const { id: themeId } = await ctx.prisma.webBotTheme.update({
            where: { id: input.themeId, userId },
            data: { theme: input.theme, title: input.title },
            select: { id: true },
          });
          savedThemeId = themeId;
        }
      }

      if (savedThemeId) {
        await ctx.prisma.botDescription.update({
          data: { themeId: savedThemeId },
          where: { id: input.botId, userId },
        });
      }

      return savedThemeId;
    }),
  getThemes: protectedProcedure
    .input(GetThemesScheme)
    .query<GetAllThemesResponse>(async ({ input, ctx }) => {
      const userId = ctx.session?.user.id;

      const userThemes = await ctx.prisma.webBotTheme.findMany({
        where: { userId, deleted: false },
      });

      const publicThemes = await ctx.prisma.webBotTheme.findMany({
        where: { deleted: false, isPublic: true },
      });

      const currentThemeId = await ctx.prisma.botDescription.findUnique({
        where: { userId, id: input.botId },
        select: { themeId: true },
      });

      return {
        userThemes,
        publicThemes,
        currentThemeId: currentThemeId?.themeId,
      };
    }),
  getThemeById: protectedProcedure.input(GetThemeByIdScheme).query<{
    theme: Prisma.JsonValue;
  } | null>(async ({ input, ctx }) => {
    const botDescriptionItem = await ctx.prisma.botDescription.findUnique({
      where: { id: input.botId },
      select: { themeId: true },
    });

    if (!botDescriptionItem?.themeId) {
      return null;
    }

    const theme = await ctx.prisma.webBotTheme.findUnique({
      where: { id: botDescriptionItem.themeId },
      select: { theme: true },
    });

    return theme;
  }),
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

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;
    const botDescriptions = await ctx.prisma.botDescription.findMany({
      where: { userId, deleted: false },
    });

    const onlineTelegramBots = await ctx.prisma.botToken.findMany({
      where: { isActive: true },
      select: { botId: true },
    });

    const result: BotDescription[] = [];
    for (const item of botDescriptions) {
      const bot: BotDescription = {
        id: item.id,
        botType: item.botType,
        name: item.name,
        production: onlineTelegramBots.some((x) => x.botId === item.id),
        updatedAt: item.updatedAt,
      };
      result.push(bot);
    }

    return result;
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
