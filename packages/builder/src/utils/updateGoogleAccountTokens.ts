import { OAuth2Client } from "google-auth-library";
import { env } from "~/env.mjs";

export async function updateGoogleAccountTokens(credentials: string) {
  const googleOAuthClient = new OAuth2Client(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    `${env.APP_URL}/api/google-auth/callback`
  );

  googleOAuthClient.setCredentials(JSON.parse(atob(credentials)));
  const data = await googleOAuthClient.refreshAccessToken();

  return data;
}
