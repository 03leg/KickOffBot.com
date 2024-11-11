import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useEmbeddedChatInfoStyles } from './EmbeddedChatInfo.style';
import { Editor } from '@monaco-editor/react';

interface Props {
    webStarterUrl: string;
    currentBotId: string;
    uniqueId: string
}

export const EmbeddedChatInfo = ({ webStarterUrl, currentBotId, uniqueId }: Props) => {
    const { classes } = useEmbeddedChatInfoStyles();


    const [value] = useState<string>(`<div id="kickoffbot-chat-${uniqueId}" style="height: 500px; width: 100%"></div>
<script>
  const kickoffbotWebStarter = document.createElement("script");
  kickoffbotWebStarter.async = true;
  kickoffbotWebStarter.type = "text/javascript";
  kickoffbotWebStarter.addEventListener("load", function () {
    window.KickOffBot.renderEmbeddedChat({
      // containerId - the id of the HTML element where the chat will be rendered
      containerId: "kickoffbot-chat-${uniqueId}",
      botId: "${currentBotId}",
      // extra data that you would like to share with your chat bot:
      //   externalVariables: {
      //     myAppUser: {
      //       id: "id1",
      //       userName: "userName #1",
      //       eMail: "email@email.com",
      //     },
      //     myWebAppPathName: location.pathname,
      //     someText: "hello world!",
      //   },
    });
  });
  kickoffbotWebStarter.src = "${webStarterUrl}";
  document.head.appendChild(kickoffbotWebStarter);
</script>
`);

    return (
        <Box className={classes.root}>
            <Typography variant='h6' className={classes.title}>Insert this code into your web page where you want to display the chat:</Typography>
            <Editor height="250px"
                defaultLanguage="html"
                value={value}
                options={{ minimap: { enabled: false }, readOnly: true }} />
        </Box>
    )
}
