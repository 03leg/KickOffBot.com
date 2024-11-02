export enum ChatViewType {
  Default = "default",
}

export interface InitOptions {
  chatViewType: ChatViewType;
  containerId: string;
  botId: string;
}
