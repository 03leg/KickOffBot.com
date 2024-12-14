import { WebBotLogItem } from "@kickoffbot.com/types";
import * as axios from "axios";
import { env } from "~/env.mjs";

export async function getDemoBotLogs(projectId: string) {
  const startResponse = await axios.default.get(
    env.NEXT_PUBLIC_WEB_BOT_RUNTIME_HOST +
      `/api/web-bot-runtime/get-bot-logs?projectId=${projectId}`
  );

  return startResponse.data as WebBotLogItem[];
}
