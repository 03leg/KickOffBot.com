import axios from "axios";
import { WebChatTheme } from "@kickoffbot.com/types";

export async function getChatTheme(appUrl: string, botId: string) {
  const startResponse = await axios.get(appUrl + `/api/chat/theme?botId=${botId}`);

  return (startResponse.data as WebChatTheme) ?? undefined;
}