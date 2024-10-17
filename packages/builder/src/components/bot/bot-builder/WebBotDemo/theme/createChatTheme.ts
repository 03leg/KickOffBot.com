import { green, red } from "@mui/material/colors";
import {
  createTheme,
  PaletteColor,
  PaletteColorOptions,
  PaletteOptions,
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
  shadowRootElement: HTMLElement | undefined = undefined
) =>
  createTheme({
    palette: {
      botMessage: {
        main: "#e3e3e3",
        contrastText: "#000000",
      },
      userMessage: {
        main: "#c5ecbe",
        contrastText: "#000000",
      },
      // background: {
      //   default: "#f5f5f5",
      // }
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
