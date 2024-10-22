import {
  BackgroundColorSchema,
  WebChatBackgroundDescription,
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
  background: WebChatBackgroundDescription
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
        main: "#e3e3e3",
        contrastText: "#000000",
      },
      userMessage: {
        main: "#c5ecbe",
        contrastText: "#000000",
      },
      background: {
        default:
          background.schema === BackgroundColorSchema.OneColor
            ? background.color1
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
