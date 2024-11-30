import { EmbeddedChatInitOptions } from "./initOptions";
import createCache from "@emotion/cache";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { CacheProvider } from "@emotion/react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { EmbeddedChat } from "./components/EmbeddedChat";

export class EmbeddedChatRenderer {
  public static async render(initOptions: EmbeddedChatInitOptions) {
    const container = document.querySelector("#" + initOptions.containerId);
    if (!container) {
      throw new Error("Failed to find container with id: " + initOptions.containerId);
    }

    const shadowContainer = container.attachShadow({ mode: "open" });
    const shadowRootElement = document.createElement("div");
    shadowRootElement.setAttribute("style", "width: 100%; height: 100%;");

    shadowContainer.appendChild(shadowRootElement);

    const cache = createCache({
      key: "kickoffbot-theme-css",
      prepend: true,
      container: shadowContainer,
    });

    const root = ReactDOM.createRoot(shadowRootElement);

    root.render(
      <React.StrictMode>
        <CacheProvider value={cache}>
          <EmbeddedChat initOptions={initOptions} shadowRootElement={shadowRootElement} />
        </CacheProvider>
      </React.StrictMode>
    );
  }
}
