import { NarrowedContext, Context } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";

export function getUserContextKey(
  context: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
) {
  const chatId = context.from.id;
  return chatId;
}
