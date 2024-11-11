import React, { useState } from 'react';
import { usePopupInfoStyles } from './PopupInfo.style';
import { Box, Typography } from '@mui/material';
import { Editor } from '@monaco-editor/react';

interface Props {
    webStarterUrl: string;
    currentBotId: string;
}

export const PopupInfo = ({ webStarterUrl, currentBotId }: Props) => {
    const { classes } = usePopupInfoStyles();


    const [value] = useState<string>(`<script>
  const kickoffbotWebStarter = document.createElement("script");
  kickoffbotWebStarter.async = true;
  kickoffbotWebStarter.type = "text/javascript";
  kickoffbotWebStarter.addEventListener("load", function () {
    window.showKickoffbotChatPopup = function () {
      window.KickOffBot.renderChatPopup({
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
    };
  });
  kickoffbotWebStarter.src = "${webStarterUrl}";
  document.head.appendChild(kickoffbotWebStarter);
</script>
`);

    return (
        <Box className={classes.root}>
            <Typography variant='h6' className={classes.title}>Insert this code into your web page and call <code>showKickoffbotChatPopup</code> function to open popup with chat:</Typography>
            <Editor height="250px"
                defaultLanguage="html"
                value={value}
                options={{ minimap: { enabled: false }, readOnly: true }} />
        </Box>
    )
}
