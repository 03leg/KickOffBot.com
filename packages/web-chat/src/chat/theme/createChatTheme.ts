import { BackgroundColorSchema, WebChatTheme } from "@kickoffbot.com/types";
import {
  alpha,
  createTheme,
  PaletteColor,
  PaletteColorOptions,
} from "@mui/material/styles";
import { defaultThemeObject } from "./defaultThemeObject";
import { getFontFamily } from "./FontFamily";

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
  viewOptions: WebChatTheme = defaultThemeObject
) => {
  const mainColor = viewOptions.primaryColors.main;
  const contrastText = viewOptions.primaryColors.contrastText;

  return createTheme({
    typography: {
      fontFamily: getFontFamily(),
    },
    palette: {
      action: {
        disabled: alpha(mainColor, 0.3),
        disabledBackground: alpha(mainColor, 0.12),
      },
      text: {
        primary: mainColor,
        secondary: alpha(mainColor, 0.6),
      },
      primary: {
        main: mainColor,
        contrastText: contrastText,
      },
      botMessage: {
        main: viewOptions.botMessageAppearance.backgroundColor,
        contrastText: viewOptions.botMessageAppearance.textColor,
      },
      userMessage: {
        main: viewOptions.userMessageAppearance.backgroundColor,
        contrastText: viewOptions.userMessageAppearance.textColor,
      },
      background: {
        default:
          viewOptions.background.schema === BackgroundColorSchema.OneColor
            ? viewOptions.background.color1
            : "#ffffff",

        paper: viewOptions.background.paperColor,
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            // '& label': {
            //   color: '#3E68A8',
            // },
            // '& label.Mui-focused': {
            //   color: '#3E68A8',
            // },
            // '& .MuiInput-underline:after': {
            //   borderBottomColor: '#3E68A8',
            // },
            "& .MuiOutlinedInput-root": {
              // color: mainColor,
              "& fieldset": {
                borderColor: mainColor,
              },
              "&:hover fieldset": {
                borderColor: mainColor,
                borderWidth: "0.15rem",
              },
              //   // '&.Mui-focused fieldset': {
              //   //   borderColor: '#3E68A8',
              //   // },
            },
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          sizeMedium: {
            color: mainColor,
            borderColor: mainColor,

            "&.Mui-selected": {
              color: contrastText,
              backgroundColor: mainColor,
            },
            "&.Mui-selected:hover": {
              color: contrastText,
              backgroundColor: alpha(mainColor, 0.8),
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          sizeMedium: {
            color: mainColor,
          },
          sizeSmall: {
            color: mainColor,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: mainColor,
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: mainColor,
          },
        },
      },

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
        styleOverrides: {
          root: {
            // <start>Fix DateTimePicker hover styles</start>
            "& .MuiPickersCalendarHeader-switchViewButton:hover": {
              backgroundColor: alpha(mainColor, 0.04), // theme.palette.action.hoverOpacity
            },
            "& .MuiPickersArrowSwitcher-button:hover": {
              backgroundColor: alpha(mainColor, 0.04), // theme.palette.action.hoverOpacity
            },
            "& .MuiPickersYear-yearButton:hover": {
              backgroundColor: alpha(mainColor, 0.04), // theme.palette.action.hoverOpacity
            },
            "& .MuiPickersYear-yearButton:focus": {
              backgroundColor: alpha(mainColor, 0.04), // theme.palette.action.hoverOpacity
            },
            "& .MuiButtonBase-root.Mui-disabled.MuiPickersDay-dayWithMargin": {
              color: alpha(mainColor, 0.4), // disable past dates (text is gray)
            },
            // <end>Fix DateTimePicker hover styles</end>
          },
        },
      },
      MuiModal: {
        defaultProps: {
          container: shadowRootElement,
        },
      },

      MuiRating: {
        styleOverrides: {
          root: {
            color: mainColor,
          },
        },
      },
    },
  });
};
