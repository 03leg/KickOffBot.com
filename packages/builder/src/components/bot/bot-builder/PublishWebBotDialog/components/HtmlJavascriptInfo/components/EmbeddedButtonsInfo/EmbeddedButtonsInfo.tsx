import React, { useState } from 'react'
import { useEmbeddedButtonsInfoStyles } from './EmbeddedButtonsInfo.style';
import { Box, Typography } from '@mui/material';
import { Editor } from '@monaco-editor/react';

interface Props {
    webStarterUrl: string;
    currentBotId: string;
    uniqueId: string
}


export const EmbeddedButtonsInfo = ({ webStarterUrl, currentBotId, uniqueId }: Props) => {

    const { classes } = useEmbeddedButtonsInfoStyles();
    const [value] = useState<string>(`<div id="kickoffbot-buttons-${uniqueId}" style="height: 500px; width: 100%"></div>
<script>
  const kickoffbotWebStarter = document.createElement("script");
  kickoffbotWebStarter.async = true;
  kickoffbotWebStarter.type = "text/javascript";
  kickoffbotWebStarter.addEventListener("load", function () {
    window.KickOffBot.renderButtons({
      // containerId - the id of the HTML element where the chat buttons will be rendered
      containerId: "kickoffbot-buttons-${uniqueId}",
      // buttons - an array of objects, each describing a button
      //   text - the text that will be displayed in the button
      //   botId - the id of the bot that will be started when the button is clicked
      buttons: [
        {
          text: "Open Chat",
          botId: "${currentBotId}",
        },
      ],
      // buttonsOrientation - the orientation of the buttons - "horizontal" or "vertical"
      buttonsOrientation: "horizontal",
      // buttonStyle - the style of the buttons - "text" or "contained" or "outlined" or "default"
      buttonStyle: "outlined",
      // buttonColor - the color of the button - any valid CSS color value
      //   default is "#3f51b5" which is a blue color
      // *It doesn't work for buttonStyle = "default"
      buttonColor: "#3f51b5",

      // buttonWidth - the width of the button - any valid CSS width value
      //   if undefined, the button will automatically set its own width
      //   based on the content of the button
      // buttonWidth: "100px",

      // buttonCssClasses - any additional CSS classes that you would like
      //   to add to the button
      //   these classes will be added to the button in addition to the
      //   default classes that are added by the chat. 
      // *It works only for buttonStyle = "default"
      // buttonCssClasses: "some-class-1 some-class-2",

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
            <Typography variant='h6' className={classes.title}>Insert this code into your web page at the location where you want to display the chat button that will open the chat in a popup:</Typography>
            <Editor height="250px"
                defaultLanguage="html"
                value={value}
                options={{ minimap: { enabled: false }, readOnly: true }} />
        </Box>
    )
}
