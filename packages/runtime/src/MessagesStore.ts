import { Message } from "telegraf/typings/core/types/typegram";

export class MessagesStore {
  private store = new Map<string, Message.TextMessage>();
  public saveMessageSendResult(elementId: string, sendResult: Message.TextMessage) {
    this.store.set(elementId, sendResult);
  }

  public getSentMessageData(id: string) {
    const sentMessageResult = this.store.get(id);

    return sentMessageResult;
  }
}
