import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleSpreedSheetHelper } from "./GoogleSpreedSheetHelper";
import { isNil, isPlainObject } from "lodash";
import { googleOAuthClient } from "./googleOAuthClient";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { throwIfNil } from "~/utils/guard";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  if (req.method === "POST") {
    const botId = req.query.botId as string;
    const connectionId = req.query.connectionId as string;
    const spreadsheetId = req.query.spreadsheetId as string;
    const sheetId = Number(req.query.sheetId);
    const newDataString = req.body.data as string;
    const newData = JSON.parse(newDataString);

    const integrationAccount =
      await GoogleSpreedSheetHelper.getGoogleIntegrationAccount(connectionId);
    if (isNil(integrationAccount)) {
      return;
    }

    const { credentials } = integrationAccount;

    googleOAuthClient.setCredentials(JSON.parse(atob(credentials)));

    const spreadSheet = new GoogleSpreadsheet(spreadsheetId, googleOAuthClient);
    await spreadSheet.loadInfo();
    const sheet = spreadSheet.sheetsById[sheetId];

    throwIfNil(sheet);

    if (isPlainObject(newData)) {
      await sheet.addRow(newData as Record<string, string>);
    }

    if (Array.isArray(newData)) {
      await sheet.addRows(newData as Record<string, string>[]);
    }

    res.status(200).send();
  }
}
