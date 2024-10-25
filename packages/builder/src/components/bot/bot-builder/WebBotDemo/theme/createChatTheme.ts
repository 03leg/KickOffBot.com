import {
  BackgroundColorSchema,
  WebChatTheme,
} from "@kickoffbot.com/types";
import { blue } from "@mui/material/colors";
import {
  alpha,
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

// const mainColor = orange[700];

export const createChatTheme = (
  shadowRootElement: HTMLElement | undefined = undefined,
  viewOptions?: WebChatTheme
) => {
  const mainColor = viewOptions?.primaryColors?.main ?? blue[800];
  const contrastText = viewOptions?.primaryColors?.contrastText ?? "#ffffff";

  return createTheme({
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

        paper: viewOptions?.background?.paperColor ?? "#ffffff",
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
    },
  });
};
