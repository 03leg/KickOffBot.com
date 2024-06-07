import { isNil } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import { google_spreadsheets_scopes } from "~/constants";
import { googleOAuthClient } from "~/constants/google-auth/googleOAuthClient";
import { googleIntegration } from "~/server/api/routers/googleIntegration";
import { prisma } from "~/server/db";

interface ResponseData {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | string>
) {
  if (req.method === "GET") {
    const code = req.query.code as string;
    if (isNil(code)) {
      return res.status(500).json({ message: "Code not found" });
    }

    const data = await googleOAuthClient.getToken(code);
    if (isNil(data.tokens.access_token)) {
      return res.status(500).json({ message: "Access token not found" });
    }

    const userInfo = await googleOAuthClient.getTokenInfo(
      data.tokens.access_token
    );
    if (isNil(userInfo.email)) {
      return res.status(500).json({ message: "Email not found" });
    }

    if (
      !google_spreadsheets_scopes.find((s: string) =>
        userInfo.scopes.includes(s)
      )
    ) {
      return res.status(500).json({ message: "Invalid scopes" });
    }

    const googleAccount = {
      email: userInfo.email,
      accessToken: data.tokens.access_token,
      credentials: btoa(JSON.stringify(data.tokens)),
    };

    const { userId } = JSON.parse(atob(req.query.state as string));

    await prisma.googleIntegrationAccount.create({
      data: {
        userId,
        email: googleAccount.email,
        accessToken: googleAccount.accessToken,
        credentials: googleAccount.credentials,
      },
    });

    return res
      .status(200)
      .send(
        "We successfully added your account. Please refresh list connections. You can close this window now."
      );
  }

  return res.status(500).json({ message: "Failed to add google account" });
}
