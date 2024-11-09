import { ButtonsChatRenderer } from "./ButtonsChatRenderer";
import { EmbeddedChatRenderer } from "./EmbeddedChatRenderer";

declare global {
  interface Window {
    KickOffBot: any;
  }
}

window.KickOffBot = window.KickOffBot ?? {
  renderEmbeddedChat: EmbeddedChatRenderer.render,
  renderButtons: ButtonsChatRenderer.renderButtons,
  renderChatPopup: ButtonsChatRenderer.renderChatPopup
};
