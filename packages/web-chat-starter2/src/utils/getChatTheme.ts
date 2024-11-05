import axios from "axios";
import { WebChatTheme } from "@kickoffbot.com/types";
import { WEB_APP_URL } from "../constants";

export async function getChatTheme(botId: string) {
  const startResponse = await axios.get(WEB_APP_URL + `/api/chat/theme?botId=${botId}`);

  return (startResponse.data as WebChatTheme) ?? undefined;
}
