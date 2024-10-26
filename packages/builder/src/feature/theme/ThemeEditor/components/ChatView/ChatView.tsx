/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import { useChatViewStyles } from './ChatView.style';
import { Box, LinearProgress, ThemeProvider } from '@mui/material';
import { ChatViewer } from '~/components/bot/bot-builder/WebBotDemo/components/ChatViewer';
import { useUserChatStore } from '~/components/bot/bot-builder/WebBotDemo/store/useUserChatStore';
import { createChatTheme } from '~/components/bot/bot-builder/WebBotDemo/theme/createChatTheme';
import chatHistory from './demoChatHistory.json';
import { useThemeDesignerStore } from '../ThemeSelector/store/useThemeDesignerStore';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';

export default function ChatView() {
  const router = useRouter();
  const botId = router.query.id as string;
  const { classes } = useChatViewStyles();
  const { isLoading: getThemesLoading } = api.botManagement.getThemes.useQuery({ botId }, {
    enabled: true,
    refetchOnWindowFocus: false,
  });
  const { background, userMessageAppearance, botMessageAppearance, primaryColors } = useThemeDesignerStore((state) => ({
    background: state.background,
    userMessageAppearance: state.userMessageAppearance,
    botMessageAppearance: state.botMessageAppearance,
    primaryColors: state.primaryColors
  }));

  const storeState = useUserChatStore((state) => ({
    setLoadingValue: state.setLoadingValue,
    setChatItems: state.setChatItems
  }));

  // storeState.setLoadingValue(true);

  useEffect(() => {
    storeState.setLoadingValue(true);
    storeState.setChatItems(chatHistory as any);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chatTheme = createChatTheme(undefined, { background, userMessageAppearance, botMessageAppearance, primaryColors });


  if (getThemesLoading) {
    return <Box className={classes.root}><LinearProgress sx={{ marginTop: 3 }} /></Box>
  }

  return (
    <><style jsx global>{`
      

.chat-box-root::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.chat-box-root::-webkit-scrollbar-track {
  background: transparent; 
}

.chat-box-root::-webkit-scrollbar-track:hover {
  background: #f1f1f1; 
}
 
.chat-box-root::-webkit-scrollbar-thumb {
  background: #8080807a; 
}

.chat-box-root::-webkit-scrollbar-thumb:hover {
  background: #808080c9; 
}

    `}</style>
      <Box className={classes.root}>
        <ThemeProvider theme={chatTheme}>
          <ChatViewer height={'100%'} projectId='' webViewOptions={{ background, botMessageAppearance, userMessageAppearance, primaryColors }} />
        </ThemeProvider>
      </Box>
    </>
  )
}
