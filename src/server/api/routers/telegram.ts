import { PrismaClient } from "@prisma/client";
import { Telegraf } from "telegraf";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
// import { prisma } from "~/server/db";
import { isNil } from "lodash";

const prisma = new PrismaClient();

export const telegramRouter = createTRPCRouter({
  checkChannel: protectedProcedure
    .input(z.object({ telegramUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const channelName = input.telegramUrl.replace("https://t.me/", "@");
      const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);

      try {
        const channelInfo = await bot.telegram.getChat(channelName);
        const userId = ctx.session?.user.id;

        const existAccount = await prisma.telegramAccount.findFirst({
          where: { accountId: channelInfo.id, userId },
          select: { id: true}
        });

        if (isNil(existAccount)) {
          await prisma.telegramAccount.create({
            data: { channelInfo: JSON.stringify(channelInfo), userId, accountId: channelInfo.id },
          });
        } else {
          await prisma.telegramAccount.update({
            data: { channelInfo: JSON.stringify(channelInfo) },
            where: { id: existAccount.id },
          });
        }
      } catch (error) {
        console.log("error", error);
        return false;
      }

      return true;
    }),
});
