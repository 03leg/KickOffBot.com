import { ButtonsChatRenderer } from "./ButtonsChatRenderer";
import { EmbeddedChatRenderer } from "./EmbeddedChatRenderer";

declare global {
  interface Window {
    KickOffBot: any;
  }
}

window.KickOffBot = window.KickOffBot ?? {
  renderEmbedChatBot: EmbeddedChatRenderer.render,
  renderButtons: ButtonsChatRenderer.render,
};
