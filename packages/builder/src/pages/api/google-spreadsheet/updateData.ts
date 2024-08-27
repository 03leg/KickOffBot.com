import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleSpreedSheetHelper } from "./GoogleSpreedSheetHelper";
import { isNil } from "lodash";
import { googleOAuthClient } from "./googleOAuthClient";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { throwIfNil } from "~/utils/guard";
import { SpreadSheetRowsFilter } from "@kickoffbot.com/types";
import { SpreadSheetRowChecker } from "~/utils/SpreadSheetRowChecker";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  if (req.method === "POST") {
    const botId = req.query.botId as string;
    const connectionId = req.query.connectionId as string;
    const spreadsheetId = req.query.spreadsheetId as string;
    const sheetId = Number(req.query.sheetId);
    const dataString = req.body.data as string;
    const requestData = JSON.parse(dataString);
    const newValue = requestData.newValue as object;
    const filter = requestData.filter as (SpreadSheetRowsFilter | undefined);

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

    const rows = await sheet.getRows();
    for (const row of rows) {
      if (!SpreadSheetRowChecker.isTargetRow(row, filter)) {
        continue;
      }

      row.assign({ ...newValue });

      await row.save();
    }

    res.status(200).send();
  }
}