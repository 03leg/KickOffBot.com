import { Breakpoint } from "@mui/material";

export interface DialogOptions {
  content: JSX.Element;
  title: string;
  buttons?: JSX.Element[];
  dialogMaxWidth?: false | Breakpoint | undefined;
}
