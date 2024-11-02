import { Prisma } from "@prisma/client";
import { isNil } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<null | Prisma.JsonValue>
) {
  if (req.method === "GET") {
    const botId = req.query.botId as string;

    if (isNil(botId)) {
      res.status(500).end();
    }

    const botDescriptionItem = await prisma.botDescription.findUnique({
      where: { id: botId },
      select: { themeId: true },
    });

    if (!botDescriptionItem?.themeId) {
      res.send(null);
      return;
    }

    const themeResult = await prisma.webBotTheme.findUnique({
      where: { id: botDescriptionItem.themeId },
      select: { theme: true },
    });

    res.send(themeResult?.theme ?? null);
  }
}
