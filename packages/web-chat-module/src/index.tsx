import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatViewType, InitOptions } from './InitOptions';
import createCache from "@emotion/cache";
import { createChatTheme } from './chat-bot/theme/createChatTheme';
import { defaultThemeObject } from './chat-bot/theme/defaultThemeObject';
import { CacheProvider } from '@emotion/react';
import {
  ThemeProvider
} from "@mui/material/styles";
import { ChatViewer } from './chat-bot/components/ChatViewer';
import { CssBaseline } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export function renderKickOffBot(initOptions: InitOptions) {
  const container = document.querySelector('#' + initOptions.containerId);
  if (!container) {
    throw new Error('Failed to find container with id: ' + initOptions.containerId);
  }

  const shadowContainer = container.attachShadow({ mode: 'open' });
  const shadowRootElement = document.createElement('div');
  shadowRootElement.setAttribute("style", "width: 100%; height: 100%;");

  shadowContainer.appendChild(shadowRootElement);

  const cache = createCache({
    key: "kickoffbot-theme-css",
    prepend: true,
    container: shadowContainer
  });

  const shadowTheme = createChatTheme(shadowRootElement, defaultThemeObject);

  const root = ReactDOM.createRoot(shadowRootElement);

  root.render(
    <React.StrictMode>
      <CacheProvider value={cache}>
        <ThemeProvider theme={shadowTheme}>
          <CssBaseline />
          <ChatViewer height={'100%'} projectId={initOptions.botId} webViewOptions={defaultThemeObject} runtimeUrl={''} />
        </ThemeProvider>
      </CacheProvider>
    </React.StrictMode>
  );
}

(window as any).renderKickOffBot = renderKickOffBot;

renderKickOffBot({
  containerId: 'root',
  botId: '',
  chatViewType: ChatViewType.Default,
});