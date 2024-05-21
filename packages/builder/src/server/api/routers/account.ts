import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { type AccountDescription } from "~/types/AccountDescription";
import { SocialMediaAccount } from "~/types/SocialMediaAccount";

export const accountRouter = createTRPCRouter({
  getAllAccounts: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session?.user.id;
    const userAccounts: AccountDescription[] = [];

    return [];
  }),
});
