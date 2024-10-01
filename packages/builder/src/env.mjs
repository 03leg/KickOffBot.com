import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),
    // Add `.min(1) on ID and SECRET if you want to make sure they're not empty
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    TELEGRAM_BOT_TOKEN: z.string(),
    SUPABASE_SERVICE_TOKEN: z.string(),
    SUPABASE_URL: z.string(),
    SUPABASE_BUCKET_ID: z.string(),
    APP_URL: z.string(),
    UNSPLASH_API_KEY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
    NEXT_PUBLIC_GOOGLE_API_KEY: z.string(),
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string(),
    NEXT_PUBLIC_GIPHY_API_KEY: z.string(),
    NEXT_PUBLIC_UNSPLASH_APP_NAME: z.string(),
    NEXT_PUBLIC_WEB_BOT_RUNTIME_HOST: z.string(),
    NEXT_PUBLIC_APP_URL: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    SUPABASE_SERVICE_TOKEN: process.env.SUPABASE_SERVICE_TOKEN,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_BUCKET_ID: process.env.SUPABASE_BUCKET_ID,
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    APP_URL: process.env.APP_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    NEXT_PUBLIC_GIPHY_API_KEY: process.env.NEXT_PUBLIC_GIPHY_API_KEY,
    NEXT_PUBLIC_UNSPLASH_APP_NAME: process.env.NEXT_PUBLIC_UNSPLASH_APP_NAME,
    UNSPLASH_API_KEY: process.env.UNSPLASH_API_KEY,
    NEXT_PUBLIC_WEB_BOT_RUNTIME_HOST: process.env.NEXT_PUBLIC_WEB_BOT_RUNTIME_HOST,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
