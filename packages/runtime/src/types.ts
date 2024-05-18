export interface BotTokenModel {
  id: string;
  botId: string;
  token: string;
  createdAt: Date;
  isActive: boolean;
  requestActiveValue: boolean | null;
}
