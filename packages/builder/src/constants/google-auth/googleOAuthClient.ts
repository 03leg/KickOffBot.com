import { OAuth2Client } from "google-auth-library";
import { env } from "~/env.mjs";

export const googleOAuthClient = new OAuth2Client(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${env.APP_URL}/api/google-auth/callback`
);
