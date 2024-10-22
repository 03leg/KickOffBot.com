import {
  BackgroundColorSchema,
  WebChatBackgroundDescription,
  WebViewBotOptions,
} from "@kickoffbot.com/types";
import {
  createTheme,
  PaletteColor,
  PaletteColorOptions,
} from "@mui/material/styles";

// declare module "@mui/material/styles" {
//   interface Theme {
//     botMessage: {
//       background: string;
//       color: string;
//     };
//   }
//   interface ThemeOptions {
//     botMessage?: {
//       background?: string;
//       color?: string;
//     };
//   }
// }

declare module "@mui/material/styles" {
  interface Palette {
    botMessage: PaletteColor;
    userMessage: PaletteColor;
  }
  interface PaletteOptions {
    botMessage?: PaletteColorOptions;
    userMessage?: PaletteColorOptions;
  }
}

export const createChatTheme = (
  shadowRootElement: HTMLElement | undefined = undefined,
  viewOptions?: WebViewBotOptions
) =>
  createTheme({
    // colorSchemes: {
    //   dark: true,
    // },
    palette: {
      // mode: "dark",
      // primary: {
      //   main: "#d41919",
      //   light: "#d41919",
      // },
      botMessage: {
        main: viewOptions?.botMessageAppearance?.backgroundColor ?? "#e3e3e3",
        contrastText: viewOptions?.botMessageAppearance?.textColor ?? "#000000",
      },
      userMessage: {
        main: viewOptions?.userMessageAppearance?.backgroundColor ?? "#c5ecbe",
        contrastText:
          viewOptions?.userMessageAppearance?.textColor ?? "#000000",
      },
      background: {
        default:
          viewOptions?.background?.schema === BackgroundColorSchema.OneColor
            ? viewOptions.background.color1
            : "#ffffff",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiPopover: {
        defaultProps: {
          container: shadowRootElement,
        },
      },
      MuiPopper: {
        defaultProps: {
          container: shadowRootElement,
        },
      },
      MuiModal: {
        defaultProps: {
          container: shadowRootElement,
        },
      },
    },
  });
