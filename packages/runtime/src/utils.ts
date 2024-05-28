import { NarrowedContext, Context } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";

export function getUserContextKey(context: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>) {
  const chatId = context.from.id;
  return chatId;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPlainObject(o: any) {
  const c = Object.prototype.toString.call(o) == "[object Object]" && o.constructor && o.constructor.name == "Object";
  return c === true;
}
