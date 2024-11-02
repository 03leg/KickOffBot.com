import axios from "axios";
import { WEB_APP_URL } from "../constants";
import { WebChatTheme } from "@kickoffbot.com/types";

export async function getChatTheme(botId: string) {
  const startResponse = await axios.get(WEB_APP_URL + `/api/chat/theme?botId=${botId}`);

  return (startResponse.data as WebChatTheme) ?? undefined;
}
