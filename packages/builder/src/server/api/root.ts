import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { telegramRouter } from "~/server/api/routers/telegram";
import { accountRouter } from "./routers/account";
import { botManagementRouter } from "./routers/bot";
import { googleIntegration } from "./routers/googleIntegration";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  telegram: telegramRouter,
  socialMediaAccount: accountRouter,
  botManagement: botManagementRouter,
  googleIntegration: googleIntegration,
});

// export type definition of API
export type AppRouter = typeof appRouter;
