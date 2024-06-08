import type { NextApiRequest, NextApiResponse } from "next";
import { google_spreadsheets_scopes } from "~/constants";
import { googleOAuthClient } from "~/constants/google-auth/googleOAuthClient";

interface ResponseData {
  message: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    const url = googleOAuthClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: google_spreadsheets_scopes,
      state: btoa(JSON.stringify({userId: req.query.userId})),
    });

    res.redirect(url);
  }
}
