import { WebChatRenderer } from "./Renderer";

declare global {
  interface Window {
    KickOffBot: any;
  }
}

window.KickOffBot = window.KickOffBot ?? {
  renderEmbedChatBot: WebChatRenderer.renderEmbedChatBot,
};
