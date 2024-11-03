import {
    BackgroundColorSchema,
    WebChatTheme,
  } from "@kickoffbot.com/types";
  import { makeStyles } from "tss-react/mui";
  import { getBackgroundColor } from "../../theme/createChatTheme.utils";
  
  export const useChatBackgroundImageStyles = makeStyles<
    { webViewOptions?: WebChatTheme } | undefined
  >()(({ palette }, options) => ({
    root: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      backgroundImage:
        options?.webViewOptions?.background?.schema ===
        BackgroundColorSchema.Image
          ? `url(${options?.webViewOptions?.background?.imageUrl})`
          : undefined,
    },
  }));
  