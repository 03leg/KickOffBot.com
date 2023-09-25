import { PrismaClient } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { delay } from "~/server/utility/debug";
import { BotDescriptionScheme } from "~/types/Bot";

const prisma = new PrismaClient();

export const botManagementRouter = createTRPCRouter({
  saveBot: protectedProcedure
    .input(BotDescriptionScheme)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      await prisma.botDescription.upsert({
        create: { userId, name: input.name },
        update: { name: input.name },
        where: { id: input.id ?? "unknown", userId },
      });
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session?.user.id;

    return ctx.prisma.botDescription.findMany({
      where: { userId, deleted: false },
    });
  }),
  removeBot: protectedProcedure
    .input(BotDescriptionScheme)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      await prisma.botDescription.update({
        data: { deleted: true },
        where: { userId, id: input.id}
      });
    }),
});
