import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { type AccountDescription } from "~/types/AccountDescription";
import { SocialMediaAccount } from "~/types/SocialMediaAccount";

export const accountRouter = createTRPCRouter({
  getAllAccounts: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;
    const userAccounts: AccountDescription[] = [];

    const telegramAccounts = await ctx.prisma.telegramAccount.findMany({
      select: { accountId: true, channelInfo: true },
      where: { userId },
    });

    if (telegramAccounts.length > 0) {
      userAccounts.push(
        ...telegramAccounts.map((telegramAccount) => {
          const parsedChannelInfo = JSON.parse(telegramAccount.channelInfo) as {
            title: string;
          };

          return {
            id: telegramAccount.accountId.toString(),
            title: parsedChannelInfo.title,
            source: SocialMediaAccount.Telegram,
          };
        })
      );
    }

    return userAccounts;
  }),
});
