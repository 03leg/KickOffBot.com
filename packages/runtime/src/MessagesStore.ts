import { Message } from "telegraf/typings/core/types/typegram";
import { throwIfNil } from "./guard";

export class MessagesStore {
  private store = new Map<string, Message.TextMessage>();
  public saveMessageSendResult(elementId: string, sendResult: Message.TextMessage) {
    this.store.set(elementId, sendResult);
  }

  public getSendMessageData(id: string) {
    const sendMessageResult = this.store.get(id);
    throwIfNil(sendMessageResult);

    return sendMessageResult;
  }
}
