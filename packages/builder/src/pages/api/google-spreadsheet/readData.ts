import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleSpreedSheetHelper } from "./GoogleSpreedSheetHelper";
import { isNil } from "lodash";
import { googleOAuthClient } from "./googleOAuthClient";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { throwIfNil } from "~/utils/guard";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown[]>
) {
  if (req.method === "GET") {
    const botId = req.query.botId as string;
    const connectionId = req.query.connectionId as string;
    const spreadsheetId = req.query.spreadsheetId as string;
    const sheetId = Number(req.query.sheetId);
    const headersString = req.query.headers as string;
    const headers = JSON.parse(headersString);

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
    const props = headers;
    const resultItems = [];

    for (const row of rows) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj: any = {};
      for (const prop of props) {
        obj[prop] = row.get(prop);
      }
      resultItems.push(obj);
    }

    res.status(200).send(resultItems);
  }
}
